import java.util.Random;

public class Player {
	private int score;
	private int warnings;
	private String username;

	private final int warnings_default = 5;

	// Array of string responses
	private String[] warning_deduction_responses = {
			"But don't worry, I have yoinked some warnings just for that :)",
			"Oh snap! I have also deducted one warning."
	};

	public Player(String username) {
		init();
		this.username = username;
	}

	public void init() {
		score = 0;
		resetWarnings();
	}

	public String getUsername() {
		return username;
	}

	public int getWarnings() {
		return warnings;
	}

	public int setWarnings(int n) {
		return this.warnings = n;
	}

	public int addWarnings(int n) {
		return this.warnings += n;
	}

	public int addWarnings() {
		return this.warnings++;
	}

	public int deductWarnings(int n) {
		this.warnings -= n;
		if (this.warnings <= 0) {
			deductScore(2);
			Print.asAuthor(
					"- Welp, and seems like you're out of warnings!\n  I will yoink some of your scored points for that :)\n");
			resetWarnings();
		}
		return this.warnings;
	}

	public int deductWarnings() {
		return deductWarnings(1);
	}

	public int resetWarnings() {
		return setWarnings(warnings_default);
	}

	public String getWarningDeductionResponse() {
		return new Random().nextBoolean()
				? warning_deduction_responses[(int) (Math.random() * warning_deduction_responses.length)]
				: null;
	}

	public int getScore() {
		return score;
	}

	public int addScore(int n) {
		return this.score += n;
	}

	public int addScore() {
		return score += 2;
	}

	public int deductScore(int n) {
		this.score -= n;
		if (this.score < 0) {
			this.score = 0;
		}
		return this.score;
	}

	public int resetScore() {
		return score = 0;
	}

}
