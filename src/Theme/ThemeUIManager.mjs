import ThemeManager from './ThemeStorageManager.mjs'
export function toggleTheme() {
    document.body.classList.toggle("dark-theme")
    const theme = document.body.classList.contains("dark-theme")
      ? "dark"
      : "light"
    ThemeManager.storeItem(theme)
  }