public class Print {

    public static void asAuthor(String s, String c, Boolean ln) {
        for (int i = 0; i < s.length(); i++) {
            System.out.print(c + s.charAt(i));
            try {
                Thread.sleep(25);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        if (ln) {
            System.out.println(ConsoleColors.RESET);
        } else {
            System.out.print(ConsoleColors.RESET);
        }
    }

    public static void asAuthor(String s, String c) {
        asAuthor(s, c, true);
    }

    public static void asAuthor(String s, Boolean ln) {
        asAuthor(s, ConsoleColors.BLUE, ln);
    }

    public static void asAuthor(String s) {
        asAuthor(s, true);
    }

    public static void text(String s, String c, Boolean ln) {
        String[] lines = s.split(System.getProperty("line.separator"));
        for (int i = 0; i < lines.length; i++) {
            System.out.print(c + lines[i] + ConsoleColors.RESET);
            try {
                Thread.sleep(25);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        if (ln) {
            System.out.println(ConsoleColors.RESET);
        } else {
            System.out.print(ConsoleColors.RESET);
        }
    }

    public static void text(String s, String c) {
        text(s, c, true);
    }

    public static void text(String s, Boolean ln) {
        text(s, ConsoleColors.RESET, ln);
    }
}
