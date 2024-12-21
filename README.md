<a href="https://docs.resynced.design/giveaway-bot/introduction" align="center">
    <img src="https://r2.resynced.design/cdn/01JFB8A2RZRMCHH6RBYP32R40B.png" align="center" />
</a>

<h1 align="center">🎉 Giveaway Bot Template</h1>

<p align="center">Consider giving this a ⭐ to show your support! <3</p>

---

Welcome to the **Open-Source Giveaway Bot Template**! This project is built using **TypeScript** and comes with everything you need to set up a fully functional giveaway bot with SQLite database support and customizable guild configurations. For a more detailed breakdown look at our **[Documentation.](https://docs.resynced.design/giveaway-bot/introduction)**

---

## 🌟 Features

-   **🔒 Secure Configurations** – Environment-based `.env` file setup
-   **⚡ TypeScript** – Enjoy type safety and cleaner code
-   **🛠 SQLite** – Lightweight database with simple guild configuration
-   **🎁 Giveaway System** – Create and manage giveaways with ease
-   **🚀 Fast Deployment** – Pre-configured for quick hosting and setup
-   **📦 Modular Design** – Easily extend and customize features

---

## 🚀 Getting Started

1. **Clone the Repository**:

    ```bash
    gh repo clone ResyncedDesign/GiveawayBot <folder-name>
    cd <folder-name>
    ```

2. **Install Dependencies**:

    Run one of the following commands to install all required packages:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3. **Set Up Environment Variables**:

    Create a `.env` file in the root directory with the following structure:

    ```plaintext
    TOKEN=your_discord_bot_token
    CLIENT_ID=your_discord_application_client_id
    ```

4. **Build and Start the Bot**:

    Compile the TypeScript code and start the bot:

    ```bash
    npm run build
    npm start
    ```

---

## ✨ Inviting the Bot to Your Server

To invite the bot to your Discord server, follow these steps:

> [!NOTE]  
> Ensure you select all the intents for the bot to work. 

1. Go to your Discord application's **OAuth2** section in the [Discord Developer Portal](https://discord.com/developers/applications).
2. Generate an invite link using the bot's **Client ID** with the required scopes and permissions. Example link:

    ```plaintext
    https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&integration_type=0&scope=applications.commands+bot
    ```

3. Replace `YOUR_CLIENT_ID` with the `CLIENT_ID` from your `.env` file.
4. Open the link in a browser and add the bot to your desired server.

---

## 📜 Configuring Giveaways

Once the bot is running, use the following commands in your server to create and manage giveaways:

-   **Start a Giveaway**:  
    Run the `/gcreate` command to create a new giveaway. You’ll be prompted to specify details like the prize, duration, and number of winners.

-   **End a Giveaway**:  
    Use `/gend` to manually conclude an active giveaway.

-   **Reroll Winners**:  
    Missed someone? Use `/greroll` to pick new winners for a completed giveaway.

---

## 🗂 Database Configuration

This bot uses **SQLite** for managing guild-specific settings. All configurations, including giveaway entries and guild preferences, are stored locally in the `database.db` file.

If you need to inspect or modify the database, you can use SQLite GUI tools such as [DB Browser for SQLite](https://sqlitebrowser.org/).

---

## 🛠️ Customizing the Bot

To start customizing, edit the files in the `src` directory. Key files include:

-   **`src/index.ts`** – Main entry point for the bot.
-   **`src/commands`** – Directory containing bot commands (add new commands here).
-   **`src/events`** – Handles bot events like ready or message creation.
-   **`src/database`** – Manages SQLite database logic.

Changes will take effect after rebuilding the project using:

```bash
npm run build
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests for improvements or new features.

---

## 💡 Suggestions or Feedback?

If you have ideas for improving this bot or encounter any issues, feel free to open an issue or reach out. Happy coding! 🎉
