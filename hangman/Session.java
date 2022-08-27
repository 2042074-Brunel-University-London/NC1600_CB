public class Session {
    private Word word;
    private Player player;

    public Session(Word word, Player player) {
        this.word = word;
        this.player = player;
    }

    public void start() {
        while (!word.isEnd()) {
            printSessionData(player, word);

            while (true) {
                Print.asAuthor("- Enter a letter: ");
                Print.asAuthor("> ", false);

                String input = System.console().readLine().trim().toLowerCase();
                Print.asAuthor("");

                if (input.length() == 1) {
                    Integer found = word.checkLetter(input.charAt(0));
                    if (found > 0) {
                        player.addScore(found * (1 + (int) (word.getDifficulty() - 1) / word.getDifficulty()));
                        break;
                    } else if (found == 0) {
                        player.deductScore(1);
                        Print.asAuthor("- Oh no! Letter '" + input + "' is not in the word!\n",
                                ConsoleColors.RED_UNDERLINED);
                        break;
                    }
                    break;
                } else {
                    player.deductWarnings();
                    Print.asAuthor("- Only one letter at a time!\n", ConsoleColors.RED_UNDERLINED);
                }
            }
        }
    }

    public void init() {
        player.init();
        word.init();
    }

    public void restart() {
        this.init();
        this.start();
    }

    public static void printSessionData(Player player, Word word) {
        Print.text("~~~~~~", ConsoleColors.YELLOW);
        Print.text("Score:" + ConsoleColors.WHITE_BRIGHT + " " + player.getScore(), ConsoleColors.YELLOW);
        Print.text("Word:" + ConsoleColors.WHITE_BRIGHT + " " + word.getCurrentWord(), ConsoleColors.YELLOW);
        Print.text("Guesses left:" + ConsoleColors.WHITE_BRIGHT + " " + word.getGuesses(), ConsoleColors.YELLOW);
        Print.text("Guessed letters:" + ConsoleColors.WHITE_BRIGHT + " " + word.getGuessedLetters().toString(),
                ConsoleColors.YELLOW);
        Print.text("Warnings left: " + ConsoleColors.WHITE_BRIGHT + player.getWarnings() + "/5", ConsoleColors.YELLOW);
        Print.text("~~~~~~", ConsoleColors.YELLOW);
    }
}
