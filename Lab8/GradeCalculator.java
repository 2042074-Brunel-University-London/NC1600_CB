public class GradeCalculator {
    /***
     * computeGrade will calculate the grade for a given mark
     * 
     * @param mark is of type integer and should be between 0-100
     * @return grade is of type String and should be between A-F
     */
    public String computeGrade(int mark) {
        String grade = "";
        if (mark >= 0 && mark < 39) {
            grade = "F";
        } else if (mark >= 40 && mark < 49) {
            grade = "D";
        } else if (mark >= 50 && mark < 59) {
            grade = "C";
        } else if (mark >= 60 && mark < 69) {
            grade = "B";
        } else if (mark >= 70) {
            grade = "A";
        }
        return grade;
    }
}