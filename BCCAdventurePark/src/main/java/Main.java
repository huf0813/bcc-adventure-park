import java.sql.SQLException;

public class Main {
    public static void main(String[] args) throws SQLException {
        System.out.println("Hello!");
        Model model = new Model();

        String[][] parks = model.returnAllFromTable("parks");
        for (String[] park : parks) {
            for (String detail : park) {
                System.out.println(detail);
            }
        }

        String[] nameOfParks = model.returnColumnFromTable("name", "parks");
        for (String name : nameOfParks) {
            System.out.println(name);
        }

    }
}
