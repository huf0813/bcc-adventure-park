import java.sql.SQLException;
import java.util.Scanner;

public class Main {
    private static Model model;

    public static void main(String[] args) throws SQLException {
        model = new Model();
        Scanner scanner = new Scanner(System.in);
        int userId = 0;

        boolean loopingManagementApp = true;
        while(loopingManagementApp) {
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

            boolean loopingAdminMenu = false;
            boolean loopingMainMenu = false;
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
                        loopingMainMenu = true;
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
                        loopingAdminMenu = true;
                    } else {
                        System.out.println("Your login credentials are false.");
                        System.out.println();
                    }
                    break;
                case 4:
                    loopingManagementApp = false;
                    break;
                default:
                    System.out.println("Please input a number.");
                    System.out.println();
                    break;
            }

            while(loopingMainMenu) {
                System.out.println();
                System.out.println("--BCC Adventure Park--");
                System.out.println("------Main Menu-------");
                System.out.println("| 1. Visit a Park");
                System.out.println("| 2. View My Account Settings");
                System.out.println("| 3. View My Account Balance");
                System.out.println("| 4. Logout");
                System.out.println();
                System.out.print("I want to.. ");
                menuId = scanner.nextInt();
                scanner.nextLine();

                boolean loopingMyBalanceMenu = false;
                switch(menuId) {
                    case 1:
                        System.out.println();
                        System.out.println("--BCC Adventure Park--");
                        System.out.println("| Let's go on an adventure!");
                        System.out.println("| Where do you want to go?");
                        String[][] parks = model.returnAllFromParks();
                        for (int i = 0; i < parks.length; i++) {
                            System.out.println("| " + (i + 1) + ". " + parks[i][1]);
                        }
                        System.out.println();
                        System.out.print("I want to go to.. ");
                        menuId = scanner.nextInt();
                        scanner.nextLine();
                        if (menuId < 1 || menuId > parks.length) {
                            System.out.println("The park you choose doesn't exist!");
                            break;
                        } else {
                            System.out.println();
                            System.out.println("Ah, you want to go to " +
                                    parks[menuId - 1][1] + ", right?");
                            System.out.println("It will cost you " +
                                    parks[menuId - 1][2] + " IDR, will you proceed?");
                            System.out.println("| 1. I will, let's go!");
                            System.out.println("| 2. I changed my mind.");
                            System.out.println();
                            System.out.print("... ");
                            int decisionId = scanner.nextInt();
                            scanner.nextLine();
                            if (decisionId != 1) {
                                break;
                            } else {
                                System.out.println();
                                System.out.println("Thank you! Your balance will be deducted right away!");
                                int temporaryBalance = balanceAfterExpense(userId,
                                        Integer.parseInt(parks[menuId - 1][2]));
                                if(temporaryBalance != -1) {
                                    if(model.updateBalanceOfVisitor(userId, temporaryBalance)) {
                                        System.out.println("Payment successful! Have fun on your adventure!");
                                    }
                                } else {
                                    System.out.println("I'm sorry! Your balance is not sufficient to conduct the payment.");
                                }
                            }
                        }
                        break;
                    case 2:
                        System.out.println();
                        System.out.println("--BCC Adventure Park--");
                        System.out.println("------My Account------");
                        String[][] userDetails = model.returnAllFromVisitorsWhereIdEqualsCondition(userId);
                        System.out.println("| Identification number: " + userDetails[0][0]);
                        System.out.println("| Username: " + userDetails[0][1]);
                        System.out.println("| Full name: " + userDetails[0][3]);
                        System.out.println();
                        System.out.println("| Settings:");
                        System.out.println("| 1. Delete my account.");
                        System.out.println("| 2. Change my full name.");
                        System.out.println();
                        System.out.print("I want to.. ");
                        menuId = scanner.nextInt();
                        scanner.nextLine();
                        if(menuId != 1) {
                            if(menuId == 2) {
                                System.out.println();
                                System.out.print("My new full name: ");
                                String fullName = scanner.nextLine();
                                if(model.updateFullNameOfVisitor(userId, fullName)) {
                                    System.out.println("Enjoy your new name.");
                                } else {
                                    System.out.println("Failed to update new full name.");
                                }
                            }
                            break;
                        } else {
                            System.out.println();
                            System.out.println("Are you sure you want to delete your account?");
                            System.out.println("| 1. I am, this app is no longer amusing.");
                            System.out.println("| 2. Yes, I want to keep going on adventures!");
                            System.out.println();
                            System.out.print("... ");
                            int decisionId = scanner.nextInt();
                            scanner.nextLine();
                            if (decisionId != 1) {
                                System.out.println("Thank you. You won't regret it.");
                            } else {
                                if(model.deleteVisitorFromVisitorsWhereIdEqualsCondition(userId)) {
                                    System.out.println("Until next time..");
                                    loopingMainMenu = false;
                                    System.out.println();
                                }
                            }
                        }
                        break;
                    case 3:
                        loopingMyBalanceMenu = true;
                        break;
                    case 4:
                        loopingMainMenu = false;
                        System.out.println("Logged out successfully.");
                        System.out.println();
                        break;
                    default:
                        System.out.println("Please input a number.");
                        break;
                }

                while(loopingMyBalanceMenu) {
                    System.out.println();
                    System.out.println("--BCC Adventure Park--");
                    System.out.println("------My Balance------");
                    int currentBalance = model.returnAccountBalance(userId);
                    System.out.println("| Total balance: " + currentBalance + " IDR");
                    System.out.println();
                    System.out.println("| Actions:");
                    System.out.println("| 1. Top up.");
                    System.out.println("| 2. Cash out.");
                    System.out.println("| 3. Return to the main menu.");
                    System.out.println();
                    System.out.print("I want to.. ");
                    menuId = scanner.nextInt();
                    scanner.nextLine();

                    switch(menuId) {
                        case 1:
                            System.out.println();
                            System.out.println("How much do you want to top up?");
                            System.out.print("I want to top up for Rp");
                            int temporaryBalance = scanner.nextInt();
                            scanner.nextLine();
                            System.out.println();
                            System.out.println("Please wait a moment..");
                            if(model.updateBalanceOfVisitor(userId, (currentBalance + temporaryBalance))) {
                                System.out.println("Top up successful!");
                            } else {
                                System.out.println("Top up failed.");
                            }
                            break;
                        case 2:
                            System.out.println();
                            System.out.println("How much do you want to cash out?");
                            System.out.print("I want to cash out for Rp");
                            temporaryBalance = scanner.nextInt();
                            scanner.nextLine();
                            System.out.println();
                            System.out.println("Please wait a moment..");
                            currentBalance -= temporaryBalance;
                            if(currentBalance < 0) {
                                System.out.println("Your balance is not sufficient to cash out.");
                            } else {
                                if (model.updateBalanceOfVisitor(userId, currentBalance)) {
                                    System.out.println("Cash out successful!");
                                } else {
                                    System.out.println("Cash out failed.");
                                }
                            }
                            break;
                        case 3:
                            loopingMyBalanceMenu = false;
                            break;
                        default:
                            System.out.println("Please input a number.");
                            break;
                    }
                }
            }

            while(loopingAdminMenu) {
                System.out.println();
                System.out.println("--BCC Adventure Park--");
                System.out.println("------Admin Menu------");
                System.out.println("| 1. Built a New Park");
                System.out.println("| 2. See a Park");
                System.out.println("| 3. Edit a Park");
                System.out.println("| 4. Delete a Park");
                System.out.println("| 5. Logout");
                System.out.println();
                System.out.print("I want to.. ");
                menuId = scanner.nextInt();
                scanner.nextLine();

                switch(menuId) {
                    case 1:
                        System.out.println();
                        System.out.println("Building in progress..");
                        System.out.print("The name of the new park: ");
                        String name = scanner.nextLine();
                        System.out.print("The park's entrance fee: ");
                        int price = scanner.nextInt();
                        scanner.nextLine();
                        boolean registered = model.insertParkIntoParks(name, price);
                        if(registered) {
                            System.out.println("Park registration is successful!");
                            System.out.println("The park's identification number is " +
                                    model.returnIdFromParksWhereNameAndPriceEqualConditions
                                            (name, price)+ ".");
                            System.out.println("The new park has been built!");
                        } else{
                            System.out.println("Park registration has failed.");
                        }
                        break;
                    case 2:
                        System.out.println();
                        System.out.println("Viewing in progress..");
                        System.out.println("| Which park do you want to see?");
                        String[][] parks = model.returnAllFromParks();
                        for (int i = 0; i < parks.length; i++) {
                            System.out.println("| " + (i + 1) + ". " + parks[i][1]);
                        }
                        System.out.println();
                        System.out.print("I want to see park number.. ");
                        menuId = scanner.nextInt();
                        scanner.nextLine();
                        if (menuId < 1 || menuId > parks.length) {
                            System.out.println("The park you choose doesn't exist!");
                            break;
                        } else {
                            System.out.println();
                            System.out.println("| Park identification number: " + parks[menuId - 1][0]);
                            System.out.println("| Name: " + parks[menuId - 1][1]);
                            System.out.println("| Entrance fee: " + parks[menuId - 1][2]);
                        }
                        break;
                    case 3:
                        System.out.println();
                        System.out.println("Editing in progress..");
                        System.out.println("| Which park do you want to edit?");
                        parks = model.returnAllFromParks();
                        for (int i = 0; i < parks.length; i++) {
                            System.out.println("| " + (i + 1) + ". " + parks[i][1]);
                        }
                        System.out.println();
                        System.out.print("I want to edit park number.. ");
                        menuId = scanner.nextInt();
                        scanner.nextLine();
                        if (menuId < 1 || menuId > parks.length) {
                            System.out.println("The park you choose doesn't exist!");
                            break;
                        } else {
                            System.out.print("I want this park's name to be: ");
                            name = scanner.nextLine();
                            System.out.print("The entrance fee of this park is: ");
                            price = scanner.nextInt();
                            scanner.nextLine();
                            int id = Integer.parseInt(parks[menuId - 1][0]);
                            boolean edited = model.updateParksWhereIdEqualsCondition(
                                    name, price, id);
                            if(edited) {
                                System.out.println("Park editing is successful!");
                            } else{
                                System.out.println("Park editing has failed.");
                            }
                        }
                        break;
                    case 4:
                        System.out.println();
                        System.out.println("Deleting in progress..");
                        System.out.println("| Which park do you want to delete?");
                        parks = model.returnAllFromParks();
                        for (int i = 0; i < parks.length; i++) {
                            System.out.println("| " + (i + 1) + ". " + parks[i][1]);
                        }
                        System.out.println();
                        System.out.print("I want to delete park number.. ");
                        menuId = scanner.nextInt();
                        scanner.nextLine();
                        if (menuId < 1 || menuId > parks.length) {
                            System.out.println("The park you choose doesn't exist!");
                            break;
                        } else {
                            int id = Integer.parseInt(parks[menuId - 1][0]);
                            boolean edited = model.deleteParkFromParksWhereIdEqualsCondition(id);
                            if(edited) {
                                System.out.println("Park has been deleted!");
                            } else{
                                System.out.println("Park deleting has failed.");
                            }
                        }
                        break;
                    case 5:
                        loopingAdminMenu = false;
                        System.out.println("Logged out successfully.");
                        System.out.println();
                        break;
                    default:
                        System.out.println("Please input a number.");
                        break;
                }
            }
        }
    }

    private static int balanceAfterExpense(int userId, int currentExpense) throws SQLException {
        int currentBalance = model.returnAccountBalance(userId);
        int temporaryBalance = currentBalance - currentExpense;
        if (temporaryBalance < 0) {
            return -1;
        } else {
            return temporaryBalance;
        }
    }

}
