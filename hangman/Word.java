import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

public class Word {
    private Player player;
    private int difficulty = 1;
    private String hiddenWord;
    private StringBuilder currentWord;
    private int guessesLeft = 10;
    private ArrayList<String> words;
    private ArrayList<Character> guessedLetters = new ArrayList<Character>();

    public Word(ArrayList<String> words, Player player, int difficulty) {
        this.words = words;
        this.player = player;
        this.difficulty = difficulty;
        init();
    }

    public Word(ArrayList<String> words, Player player) {
        this.words = words;
        this.player = player;
        init();
    }

    public Word(Player player, int difficulty) {
        this.player = player;
        this.difficulty = difficulty;
        init();
    }

    public Word(Player player) {
        this.words = initWords();
        this.player = player;
        init();
    }

    public void init() {
        this.difficulty = setDifficulty();
        hiddenWord = words.get((int) (Math.random() * words.size()));
        this.hiddenWord = hiddenWord.toLowerCase();
        this.currentWord = new StringBuilder(hiddenWord);
        for (int i = 0; i < hiddenWord.length(); i++) {
            if (hiddenWord.charAt(i) == ' ') {
                currentWord.setCharAt(i, ' ');
            } else {
                currentWord.setCharAt(i, '_');
            }
        }
        int n = (int) ((Math.pow(hiddenWord.length(), 2) - difficulty) / (hiddenWord.length() * difficulty));
        this.guessesLeft = n > 4 - difficulty ? n : 4 - difficulty + 1;
        this.guessedLetters = new ArrayList<Character>();
    }

    private static ArrayList<String> initWords() {
        File wordsFile = new File("./data/words");

        ArrayList<String> words = new ArrayList<>();

        try (Scanner wordsScanner = new Scanner(wordsFile)) {
            while (wordsScanner.hasNextLine()) {
                for (String word : wordsScanner.nextLine().split(",")) {
                    words.add(word.trim().toLowerCase());
                }
            }
            wordsScanner.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        return words;
    }

    public ArrayList<String> getWords() {
        return words;
    }

    public String getHiddenWord() {
        return hiddenWord;
    }

    public String getCurrentWord() {
        return currentWord.toString();
    }

    public int getGuesses() {
        return guessesLeft;
    }

    public Integer setDifficulty() {
        Print.asAuthor("\n  Now select desired difficulty level: ");
        Print.asAuthor("  1. Easy");
        Print.asAuthor("  2. Medium");
        Print.asAuthor("  3. Hard");
        Print.asAuthor("  4. Impossible");
        Print.asAuthor("  > ", false);
        String difficulty = System.console().readLine().trim();

        while (!difficulty.matches("[1-4]+")) {
            Print.asAuthor("\n- Please enter a valid difficulty level!\n", false);
            Print.asAuthor("  > ", false);
            difficulty = System.console().readLine().trim();
        }

        return Integer.parseInt(difficulty);
    }

    public int getDifficulty() {
        return difficulty;
    }

    public String getGuessedLetters() {
        Collections.sort(guessedLetters);
        return guessedLetters.toString().replace("[", "").replace("]", "");
    }

    public Integer checkLetter(Character letter) {
        if (letter < 'a' || letter > 'z') {
            String r = player.getWarningDeductionResponse();
            Print.asAuthor("- Unfortunately, only letters from a to z are allowed!",
                    ConsoleColors.BLUE);

            if (r != null) {
                Print.asAuthor("  " + r, ConsoleColors.BLUE);
            }

            Print.asAuthor("");

            player.deductWarnings();
            return -1;
        }

        for (char l : guessedLetters) {
            if (l == letter) {
                String r = player.getWarningDeductionResponse();
                Print.asAuthor("- Hmm, seems like '" + letter + "' has already been guessed!",
                        ConsoleColors.BLUE);

                if (r != null) {
                    Print.asAuthor("  " + r, ConsoleColors.BLUE);
                }

                Print.asAuthor("");

                player.deductWarnings();
                return -1;
            }
        }
        guessedLetters.add(letter);

        Integer found = 0;
        for (int i = 0; i < hiddenWord.length(); i++) {
            if (hiddenWord.charAt(i) == letter) {
                currentWord.setCharAt(i, letter);
                found++;
            }
        }

        if (found > 0) {
            return found;
        }

        guessesLeft -= 1;
        return 0;
    }

    public boolean isEnd() {
        if (guessesLeft <= 0) {
            // ask if user wants to play
            Print.asAuthor("- Seems like you lost ;<\n  But don't worry, we all fail sometimes!"
                    + "\n  But yeah, the hidden word was '", false);
            Print.asAuthor(hiddenWord, ConsoleColors.BLUE_UNDERLINED, false);
            Print.asAuthor("'.\n");
            return true;
        }

        if (currentWord.toString().equals(hiddenWord)) {
            if (difficulty == 4) {
                Print.asAuthor("- Impossible... Well, apperantly not! Anyways...");
            }
            Print.asAuthor("  Congratulations! You found the hidden word '", ConsoleColors.GREEN, false);
            Print.asAuthor(hiddenWord, ConsoleColors.GREEN_UNDERLINED, false);
            Print.asAuthor("'!\n", ConsoleColors.GREEN);
            player.addScore(hiddenWord.length());
            return true;
        }

        return false;
    }
}