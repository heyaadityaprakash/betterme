# BetterMe (React Native Journal App Prototype)

This repository contains a first implementation pass for your app idea with four bottom tabs:

1. Todo
2. Journals
3. Tracker
4. Account

## Included in this step

- Bottom tab layout (custom tab bar)
- Todo screen:
  - Current day and date
  - Rounded task cards with checkbox
  - Optional tags
  - Priority colors (red/green/yellow)
  - Sorting by creation time, priority, and end time
- Journals screen:
  - Folder filters (Personal Growth, Work, Family, Hobbies)
  - Folder-only mode toggle
  - Search notes by date or text
  - New note area with current date/time header
  - Placeholder zones for free placement images/stickers
  - Share action buttons for PDF/image
- Tracker screen:
  - Top summary: income, spent, left
  - Expense table with categories
  - Category analysis bars
- Account screen:
  - Profile/settings placeholder card

## Next suggested steps

- Convert to full Expo app scaffold (`npx create-expo-app`) if needed.
- Add persistent storage (AsyncStorage / SQLite / backend).
- Add a true rich-note canvas for draggable stickers/images.
- Implement real sharing via `react-native-share`, PDF generation, and screenshot capture.
- Replace bar chart with chart library (Victory, Recharts wrapper, or react-native-svg-charts).
