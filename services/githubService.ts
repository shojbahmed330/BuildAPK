
import { GithubConfig } from "../types";

export class GithubService {
  private workflowYaml = `name: Build Android APK
on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Initialize Capacitor and Build APK
        run: |
          rm -rf www android capacitor.config.json
          mkdir -p www
          cp index.html main.js style.css www/ 2>/dev/null || true
          if [ ! -f www/index.html ]; then
            find . -maxdepth 1 -type f -not -name "package*" -exec cp {} www/ \;
          fi
          if [ ! -f package.json ]; then npm init -y; fi
          npm install @capacitor/core@latest @capacitor/cli@latest @capacitor/android@latest
          npx cap init "OneClickApp" "com.oneclick.studio" --web-dir www
          npx cap add android
          echo "android.enableJetifier=true" >> android/gradle.properties
          echo "android.useAndroidX=true" >> android/gradle.properties
          sed -i 's/JavaVersion.VERSION_17/JavaVersion.VERSION_21/g' android/app/build.gradle
          sed -i 's/JavaVersion.VERSION_11/JavaVersion.VERSION_21/g' android/app/build.gradle
          sed -i 's/JavaVersion.VERSION_1_8/JavaVersion.VERSION_21/g' android/app/build.gradle
          
          echo "android { packagingOptions { resources { pickFirst 'META-INF/kotlin-stdlib.kotlin_module'; pickFirst 'META-INF/kotlin-stdlib-jdk8.kotlin_module'; pickFirst 'META-INF/kotlin-stdlib-jdk7.kotlin_module'; pickFirst 'META-INF/AL2.0'; pickFirst 'META-INF/LGPL2.1' } } }" >> android/app/build.gradle
          echo "configurations.all { resolutionStrategy { force 'org.jetbrains.kotlin:kotlin-stdlib:1.9.10'; force 'org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.9.10'; force 'org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.9.10' } }" >> android/app/build.gradle

          npx cap copy android
          cd android
          chmod +x gradlew
          ./gradlew assembleDebug

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-debug
          path: android/app/build/outputs/apk/debug/app-debug.apk`;

  private toBase64(str: string): string {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      return btoa(str);
    }
  }

  async pushToGithub(config: GithubConfig, files: Record<string, string>) {
    const { token, owner, repo } = config;
    if (!token || !owner || !repo) throw new Error("Invalid GitHub Config");

    const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const headers = {
      'Authorization': `token ${token}`, 
      'Accept': 'application/vnd.github.v3+json'
    };

    // 1. Check if Repo Exists, if not Create it
    const repoCheck = await fetch(baseUrl, { headers });
    if (repoCheck.status === 404) {
      const createRes = await fetch(`https://api.github.com/user/repos`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: repo, private: true, auto_init: true })
      });
      if (!createRes.ok) throw new Error("Failed to create repository automatically.");
      await new Promise(r => setTimeout(r, 3000)); // Wait for GH to init
    }

    const allFiles = { ...files, '.github/workflows/android.yml': this.workflowYaml };

    for (const [path, content] of Object.entries(allFiles)) {
      const getRes = await fetch(`${baseUrl}/contents/${path}`, { headers });
      let sha: string | undefined;
      if (getRes.ok) {
        const getData = await getRes.json();
        sha = getData.sha;
      }

      await fetch(`${baseUrl}/contents/${path}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Update ${path} via OneClick Studio`,
          content: this.toBase64(content),
          sha: sha
        })
      });
    }
  }

  async getLatestApk(config: GithubConfig) {
    const { token, owner, repo } = config;
    const headers = { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' };
    try {
      const runsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=1`, { headers });
      const runsData = await runsRes.json();
      const latestRun = runsData.workflow_runs?.[0];
      if (!latestRun || latestRun.status !== 'completed' || latestRun.conclusion !== 'success') return null;

      const artifactsRes = await fetch(latestRun.artifacts_url, { headers });
      const data = await artifactsRes.json();
      const artifact = data.artifacts?.find((a: any) => a.name === 'app-debug');
      if (!artifact) return null;

      return { downloadUrl: artifact.archive_download_url, webUrl: latestRun.html_url };
    } catch (e) { return null; }
  }

  async downloadArtifact(config: GithubConfig, url: string) {
    const res = await fetch(url, { headers: { 'Authorization': `token ${config.token}` } });
    return await res.blob();
  }
}
