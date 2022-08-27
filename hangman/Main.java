import java.io.IOException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) throws IOException, InterruptedException {

        // Ask for permission to start the game
        Print.asAuthor("\n- Oh, hello! Welcome to Hangman!");
        Print.asAuthor("  Shall we start the game? (y/n)");
        Print.asAuthor("  > ", false);

        Scanner sc = new Scanner(System.in);
        String startRes = sc.nextLine().trim();

        if (startRes.equalsIgnoreCase("y") || startRes.equalsIgnoreCase("yes")) {
            // Ask for username
            Print.asAuthor("\n- Got it, but I will need your username first!\n", false);
            Print.asAuthor("  > ", false);

            String username = sc.nextLine().trim();

            // Validate username
            while (username.length() <= 0) {
                Print.asAuthor("\n- I need your username -_-\n", false);
                Print.asAuthor("  > ", false);
                username = sc.nextLine().trim();
            }

            // Initialize player
            Player player = new Player(username);

            Print.asAuthor("\n- Sounds great, ", false);
            Print.asAuthor(player.getUsername(), ConsoleColors.BLUE_UNDERLINED, false);
            Print.asAuthor("!", false);

            // Initialize word
            Word word = new Word(player);

            Print.asAuthor("\n- "
                    + (word.getDifficulty() == 4
                            ? "Wow. Alright. Good luck with "
                                    + word.getGuesses() + " guess"
                                    + (word.getGuesses() > 1 ? "es" : "") + " you have!"
                            : "Let's start the game!")
                    + "\n");

            // Initialize session
            Session session = new Session(word, player);

            // Start the game
            session.start();

            // Reset the game
            while (true) {
                Print.asAuthor("- Play again? :) (y/n)");
                Print.asAuthor("  > ", false);
                String restartRes = sc.nextLine().trim();

                if (restartRes.equalsIgnoreCase("y") || restartRes.equalsIgnoreCase("yes")) {
                    Print.asAuthor("\n- Great! Reusing the same start() function then!");
                    session.restart();
                } else {
                    Print.asAuthor("\n- Welp, see you later then!\n  Sayōnara!\n");
                    break;
                }
            }
            sc.close();
        } else {
            Print.asAuthor("\n- Got it! Cancelling the session...\n  Sayōnara!\n");
        }
    }
}
