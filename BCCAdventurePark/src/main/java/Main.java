import java.sql.SQLException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) throws SQLException {
        Model model = new Model();
        Scanner scanner = new Scanner(System.in);
        int userId;

        boolean loopingMenu1 = true;
        boolean loopingMenu2 = false;
        while(loopingMenu1) {
            System.out.println("--BCC Adventure Park--");
            System.out.println("----Management App----");
            System.out.println("| 1. Register as Visitor");
            System.out.println("| 2. Login as Visitor");
            System.out.println("| 3. Login as Admin");
            System.out.println("| 4. Exit");
            System.out.println();
            System.out.print("I want to.. ");
            int menuId = scanner.nextInt();
            scanner.nextLine();

            switch(menuId) {
                case 1:
                    System.out.println();
                    System.out.println("Welcome, new visitor!");
                    System.out.println("Please fill these informations correctly to register.");
                    System.out.print("Your account's username: ");
                    String username = scanner.nextLine();
                    System.out.print("Your account's password: ");
                    String password = scanner.nextLine();
                    System.out.print("Your full name: ");
                    String fullName = scanner.nextLine();
                    boolean registered = model.insertVisitorIntoVisitors(
                            username, password, fullName);
                    if(registered) {
                        System.out.println("Registration successful!");

                        System.out.println("Your identification number is " +
                                model.returnUserIdIfVisitorSuccessfullyLogin
                                (username, password) + ".");
                        System.out.println("Don't forget to login!");
                    } else{
                        System.out.println("Registration failed.");
                    }
                    System.out.println();
                    break;
                case 2:
                    System.out.println();
                    System.out.println("Please input your login credentials.");
                    System.out.print("Username: ");
                    username = scanner.nextLine();
                    System.out.print("Password: ");
                    password = scanner.nextLine();
                    userId = model.returnUserIdIfVisitorSuccessfullyLogin
                            (username, password);
                    if(userId != 0) {
                        loopingMenu2 = true;
                    } else {
                        System.out.println("Your login credentials are false.");
                        System.out.println();
                    }
                    break;
                case 3:
                    System.out.println();
                    System.out.println("Please input your login credentials.");
                    System.out.print("Username: ");
                    username = scanner.nextLine();
                    System.out.print("Password: ");
                    password = scanner.nextLine();
                    userId = model.returnUserIdIfAdminSuccessfullyLogin
                            (username, password);
                    if(userId != 0) {
                        loopingMenu2 = true;
                    } else {
                        System.out.println("Your login credentials are false.");
                        System.out.println();
                    }
                    break;
                case 4:
                    loopingMenu1 = false;
                    break;
                default:
                    System.out.println("Please input a number.");
                    System.out.println();
                    break;

            }

            while(loopingMenu2) {
                System.out.println("Well, welcome!");
                break;
            }

        }
    }
}
