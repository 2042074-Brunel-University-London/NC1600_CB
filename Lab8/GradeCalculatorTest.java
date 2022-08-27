
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class GradeCalculatorTest {

    @Test
    void computeGradeTest() {
        GradeCalculator calc = new GradeCalculator();
        String output = calc.computeGrade(65);
        assertEquals("B", output);
    }
}
