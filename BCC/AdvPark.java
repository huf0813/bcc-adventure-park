package BCC;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Scanner;

public class AdvPark {
    static Scanner scan = new Scanner(System.in);
    static String uid;

    public static void main(String[] args) {
        start();
    }

    public static void start() {
        boolean on = true, login = false;
        while (on) {
            String error = "Not found";
            try {
                Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
                Connection conn = DriverManager.getConnection("jdbc:sqlserver://localhost:1433;databaseName=bccpark;integratedSecurity=true");
                ArrayList<String> alp = new ArrayList<>();
                String query;
                PreparedStatement pst;
                ResultSet rs;
                Statement st = conn.createStatement();
                System.out.println("Welcome to BCC Adventure Park");
                System.out.println("Menu : ");
                System.out.println("1. Register");
                System.out.println("2. Login");
                System.out.println("3. Quit");
                int s = scan.nextInt();
                scan.nextLine();
                switch (s) {
                    case 1:
                        System.out.println("Registering a new visitor");
                        System.out.println("Full name : ");
                        alp.add(scan.nextLine());
                        System.out.println("Email : ");
                        alp.add(scan.nextLine());
                        System.out.println("Phone number : ");
                        alp.add(scan.nextLine());
                        System.out.println("Username : ");
                        alp.add(scan.nextLine());
                        System.out.println("Password : ");
                        alp.add(scan.nextLine());
                        query = "exec regvisitor ?,?,?,?,?";
                        pst = conn.prepareStatement(query);
                        pst.setString(1, alp.get(0));
                        pst.setString(2, alp.get(1));
                        pst.setString(3, alp.get(2));
                        pst.setString(4, alp.get(3));
                        pst.setString(5, alp.get(4));
                        pst.executeUpdate();
                        rs = st.executeQuery("select * from visitor where username='" + alp.get(3) + "' and password='" + alp.get(4) + "'");
                        while (rs.next()) {
                            System.out.println("Your visitor's identity number is : " + rs.getString(1));
                        }
                        break;
                    case 2:
                        error = "Incorrect username/password";
                        System.out.print("Username : ");
                        alp.add(scan.nextLine());
                        System.out.print("Password : ");
                        alp.add(scan.nextLine());
                        rs = st.executeQuery("exec auth '" + alp.get(0) + "', '" + alp.get(1) + "'");
                        while (rs.next())
                            uid = rs.getString(1);
                        if (uid != null)
                            login = true;
                        else
                            System.err.println(error);
                        break;
                    case 3:
                        on = false;
                        break;
                }
                while (login) {
                    ArrayList<String> al = new ArrayList<>();
                    String pw = "", un = "";
                    if (uid.equals("1")) {
                        try {
                            rs = st.executeQuery("select name from visitor where visitor_id=" + 1);
                            while (rs.next())
                                System.out.println("Welcome " + rs.getString(1) + " (administrator)");
                            System.out.println("Select service : ");
                            System.out.println("1. Register a new park");
                            System.out.println("2. See a park detail");
                            System.out.println("3. Edit a park");
                            System.out.println("4. Remove a park");
                            System.out.println("5. See the usernames and passwords of all accounts");
                            System.out.println("6. See profile");
                            System.out.println("7. Change profile");
                            System.out.println("8. Change username");
                            System.out.println("9. Change password");
                            System.out.println("10. Logout");
                            System.out.println("11. Quit");
                            int i = scan.nextInt();
                            scan.nextLine();
                            switch (i) {
                                case 1:
                                    System.out.println("Registering a new park");
                                    System.out.println("Park name : ");
                                    al.add(scan.nextLine());
                                    System.out.println("Location : ");
                                    al.add(scan.nextLine());
                                    System.out.println("Entrance ticket price : ");
                                    al.add(scan.nextLine());
                                    query = "exec regpark ?,?,?";
                                    pst = conn.prepareStatement(query);
                                    pst.setString(1, al.get(0));
                                    pst.setString(2, al.get(1));
                                    pst.setString(3, al.get(2));
                                    pst.executeUpdate();
                                    rs = st.executeQuery("select park_id from park where name='" + al.get(0) + "' and location='" + al.get(1) + "' and price=" + al.get(2));
                                    while (rs.next()) {
                                        System.out.println("This park's identity number is : " + rs.getString(1));
                                    }
                                    break;
                                case 2:
                                    System.out.println("Which park do you wanna see? ");
                                    rs = st.executeQuery("select * from park");
                                    while (rs.next()) {
                                        System.out.println(rs.getString(1) + ". " + rs.getString(2));
                                    }
                                    al.add(scan.nextLine());
                                    query = "exec getparkdetail ";
                                    rs = st.executeQuery(query + al.get(0));
                                    while (rs.next()) {
                                        System.out.println("Park ID : " + rs.getString(1));
                                        System.out.println("Park name : " + rs.getString(2));
                                        System.out.println("Location : " + rs.getString(3));
                                        System.out.println("Entrance ticket price : Rp " + rs.getString(4));
                                        System.out.println("Registration date : " + rs.getDate(5));
                                    }
                                    break;
                                case 3:
                                    System.out.println("Which park do you wanna edit? ");
                                    rs = st.executeQuery("select * from park");
                                    while (rs.next()) {
                                        System.out.println(rs.getString(1) + ". " + rs.getString(2));
                                    }
                                    al.add(scan.nextLine());
                                    query = "exec getparkdetail ";
                                    rs = st.executeQuery(query + al.get(0));
                                    while (rs.next()) {
                                        System.out.println("Old park name : " + rs.getString(2));
                                        System.out.println("New park name (- for skip) : ");
                                        al.add(scan.nextLine());
                                        if (al.get(1).equals("-"))
                                            al.set(1, rs.getString(2));
                                        System.out.println("Old location : " + rs.getString(3));
                                        System.out.println("New location (- for skip) : ");
                                        al.add(scan.nextLine());
                                        if (al.get(2).equals("-"))
                                            al.set(2, rs.getString(3));
                                        System.out.println("Old entrance ticket price : Rp " + rs.getString(4));
                                        System.out.println("New entrance ticket price (- for skip) : Rp ");
                                        al.add(scan.nextLine());
                                        if (al.get(3).equals("-"))
                                            al.set(3, rs.getString(4));
                                    }
                                    query = "exec editpark ?,?,?,?";
                                    pst = conn.prepareStatement(query);
                                    pst.setString(1, al.get(0));
                                    pst.setString(2, al.get(1));
                                    pst.setString(3, al.get(2));
                                    pst.setString(4, al.get(3));
                                    pst.executeUpdate();
                                    System.out.println("Successfully edited");
                                    break;
                                case 4:
                                    System.out.println("Which park do you wanna remove? ");
                                    rs = st.executeQuery("select * from park");
                                    while (rs.next()) {
                                        System.out.println(rs.getString(1) + ". " + rs.getString(2));
                                    }
                                    al.add(scan.nextLine());
                                    query = "exec delpark ?";
                                    pst = conn.prepareStatement(query);
                                    pst.setString(1, al.get(0));
                                    pst.executeUpdate();
                                    System.out.println("Successfully removed");
                                    break;
                                case 5:
                                    rs = st.executeQuery("select visitor_id,username,password from visitor where visitor_id!=" + uid);
                                    while (rs.next()) {
                                        System.out.println(rs.getString(1) + ". Username : " + rs.getString(2));
                                        System.out.println("   Password : " + rs.getString(3));
                                    }
                                    break;
                                case 6:
                                    rs = st.executeQuery("exec getvisdetail " + uid);
                                    while (rs.next()) {
                                        System.out.println("User ID : " + rs.getString(1));
                                        System.out.println("Full name : " + rs.getString(2));
                                        System.out.println("Phone number : " + rs.getString(3));
                                        System.out.println("Username : " + rs.getString(4));
                                        System.out.println("Password : " + rs.getString(5));
                                        System.out.println("Registration date : " + rs.getString(6));
                                    }
                                    break;
                                case 7:
                                    rs = st.executeQuery("select * from visitor where visitor_id=" + uid);
                                    while (rs.next()) {
                                        System.out.println("Old Full name : " + rs.getString(2));
                                        System.out.println("New Full name (- for skip) : ");
                                        al.add(scan.nextLine());
                                        if (al.get(0).equals("-"))
                                            al.set(0, rs.getString(2));
                                        System.out.println("Old phone number : " + rs.getString(3));
                                        System.out.println("New phone number (- for skip) : ");
                                        al.add(scan.nextLine());
                                        if (al.get(1).equals("-"))
                                            al.set(1, rs.getString(3));
                                        System.out.println("Old email : " + rs.getString(4));
                                        System.out.println("New email (- for skip) : ");
                                        al.add(scan.nextLine());
                                        if (al.get(2).equals("-"))
                                            al.set(2, rs.getString(4));
                                    }
                                    query = "exec chvis ?,?,?,?";
                                    pst = conn.prepareStatement(query);
                                    pst.setString(1, uid);
                                    pst.setString(2, al.get(0));
                                    pst.setString(3, al.get(1));
                                    pst.setString(4, al.get(2));
                                    pst.executeUpdate();
                                    System.out.println("Successfully edited");
                                    break;
                                case 8:
                                    rs = st.executeQuery("select username,password from visitor where visitor_id=" + uid);
                                    while (rs.next()) {
                                        un = rs.getString(1);
                                        pw = rs.getString(2);
                                    }
                                    System.out.println("Old username : " + un);
                                    System.out.print("New username : ");
                                    al.add(scan.nextLine());
                                    System.out.print("Enter your password : ");
                                    al.add(scan.nextLine());
                                    if (!pw.equals(al.get(1))) {
                                        System.out.println("Incorrect password, please try again");
                                        break;
                                    }
                                    pst = conn.prepareStatement("exec chuname ?,?");
                                    pst.setString(1, uid);
                                    pst.setString(2, al.get(0));
                                    pst.executeUpdate();
                                    System.out.println("Username updated");
                                    break;
                                case 9:
                                    rs = st.executeQuery("select password from visitor where visitor_id=" + uid);
                                    while (rs.next())
                                        pw = rs.getString(1);
                                    System.out.print("Old password : ");
                                    al.add(scan.nextLine());
                                    System.out.print("New password : ");
                                    al.add(scan.nextLine());
                                    System.out.print("Reenter new password : ");
                                    al.add(scan.nextLine());
                                    if (!pw.equals(al.get(0))) {
                                        System.out.println("Incorrect password, please try again");
                                        break;
                                    }
                                    if (!al.get(1).equals(al.get(2))) {
                                        System.out.println("New password does not match, please try again");
                                        break;
                                    }
                                    pst = conn.prepareStatement("exec chpw ?,?");
                                    pst.setString(1, uid);
                                    pst.setString(2, al.get(1));
                                    pst.executeUpdate();
                                    System.out.println("Password updated");
                                    break;
                                case 10:
                                    login = false;
                                    break;
                                case 11:
                                    login = on = false;
                                    break;
                            }
                        } catch (Exception e) {
                            System.err.println(error);
                        }
                    } else {
                        try {
                            rs = st.executeQuery("select name from visitor where visitor_id=" + uid);
                            while (rs.next())
                                System.out.println("Welcome " + rs.getString(1));
                            System.out.println("1. See a park detail");
                            System.out.println("2. I wanna top-up my balance");
                            System.out.println("3. I wanna know my balance");
                            System.out.println("4. I wanna visit a park");
                            System.out.println("5. I wanna see my profile");
                            System.out.println("6. I wanna edit my current balance");
                            System.out.println("7. I wanna delete my account");
                            System.out.println("8. I wanna change my profile");
                            System.out.println("9. I wanna change my username");
                            System.out.println("10. I wanna change my password");
                            System.out.println("11. Logout");
                            System.out.println("12. Quit");
                            int cur = 0;
                            int i = scan.nextInt();
                            scan.nextLine();
                            switch (i) {
                                case 1:
                                    System.out.println("Which park do you wanna see? ");
                                    rs = st.executeQuery("select * from park");
                                    while (rs.next()) {
                                        System.out.println(rs.getString(1) + ". " + rs.getString(2));
                                    }
                                    al.add(scan.nextLine());
                                    query = "exec getparkdetail ";
                                    rs = st.executeQuery(query + al.get(0));
                                    while (rs.next()) {
                                        System.out.println("Park ID : " + rs.getString(1));
                                        System.out.println("Park name : " + rs.getString(2));
                                        System.out.println("Location : " + rs.getString(3));
                                        System.out.println("Entrance ticket price : Rp " + rs.getString(4));
                                        System.out.println("Registration date : " + rs.getDate(5));
                                    }
                                    break;
                                case 2:
                                    error = "Invalid input, please enter numbers only";
                                    System.out.println("Enter your money");
                                    al.add(scan.nextLine());
                                    if (Integer.parseInt(al.get(0)) < 0) {
                                        System.out.println("The balance entered cannot be negative");
                                        break;
                                    }
                                    query = "exec topup ?,?";
                                    pst = conn.prepareStatement(query);
                                    pst.setString(1, uid);
                                    pst.setString(2, al.get(0));
                                    pst.executeUpdate();
                                    rs = st.executeQuery("exec getbalance " + uid);
                                    System.out.println("Successfully top-up balance");
                                    while (rs.next())
                                        System.out.println("Your current balance is : Rp " + rs.getString(1));
                                    break;
                                case 3:
                                    rs = st.executeQuery("exec getbalance " + uid);
                                    while (rs.next())
                                        System.out.println("Your current balance is : Rp " + rs.getString(1));
                                    break;
                                case 4:
                                    error = "Park not found";
                                    System.out.println("Which park you wanna visit? ");
                                    ResultSet rst, rsp;
                                    rs = st.executeQuery("select * from park");
                                    while (rs.next())
                                        System.out.println(rs.getString(1) + ". " + rs.getString(2));
                                    al.add(scan.nextLine());
                                    int pr = 0;
                                    rsp = st.executeQuery("select price from park where park_id=" + al.get(0));
                                    rst = st.executeQuery("exec getbalance " + uid);
                                    while (rsp.next())
                                        pr = Integer.parseInt(rsp.getString(1));
                                    while (rst.next())
                                        cur = Integer.parseInt(rst.getString(1));
                                    if (cur - pr < 0) {
                                        System.out.println("Insufficient balance");
                                        break;
                                    }
                                    query = "exec visit ?,?";
                                    pst = conn.prepareStatement(query);
                                    pst.setString(1, uid);
                                    pst.setString(2, al.get(0));
                                    pst.executeUpdate();
                                    System.out.println("Successfully expensing balance");
                                    rs = st.executeQuery("exec getbalance " + al.get(2));
                                    while (rs.next())
                                        System.out.println("Your current balance is : Rp " + rs.getString(1));
                                    break;
                                case 5:
                                    rs = st.executeQuery("exec getvisdetail " + uid);
                                    while (rs.next()) {
                                        System.out.println("Visitor ID : " + rs.getString(1));
                                        System.out.println("Full name : " + rs.getString(2));
                                        System.out.println("Phone number : " + rs.getString(3));
                                        System.out.println("Username : " + rs.getString(4));
                                        System.out.println("Password : " + rs.getString(5));
                                        System.out.println("Registration date : " + rs.getString(6));
                                        System.out.println("Balance : Rp " + rs.getString(7));
                                    }
                                    break;
                                case 6:
                                    error = "Invalid input, please enter numbers only";
                                    rs = st.executeQuery("exec getbalance " + uid);
                                    while (rs.next())
                                        al.add(rs.getString(1));
                                    System.out.println("Your current balance is : Rp " + al.get(0));
                                    System.out.println("Wanna change it to how many?");
                                    al.add(scan.nextLine());
                                    if (Integer.parseInt(al.get(1)) < 0) {
                                        System.out.println("The balance entered cannot be negative");
                                        break;
                                    }
                                    query = "exec editbalance ?,?";
                                    pst = conn.prepareStatement(query);
                                    pst.setString(1, uid);
                                    pst.setString(2, al.get(1));
                                    pst.executeUpdate();
                                    System.out.println("Successfully edited");
                                    rs = st.executeQuery("exec getbalance " + uid);
                                    while (rs.next())
                                        al.add(rs.getString(1));
                                    System.out.println("Your current balance is : Rp " + al.get(2));
                                    break;
                                case 7:
                                    error = "Not found";
                                    rs = st.executeQuery("select name from visitor where visitor_id =" + uid);
                                    while (rs.next())
                                        System.out.println("Are you sure Mr./Mrs. " + rs.getString(1) + " to delete your account? (Y/N)");
                                    String ans = scan.nextLine();
                                    while (!ans.equalsIgnoreCase("Y") && !ans.equalsIgnoreCase("N")) {
                                        while (rs.next())
                                            System.out.println("Are you sure Mr./Mrs. " + rs.getString(1) + " to delete your account? (Y/N)");
                                        ans = scan.nextLine();
                                    }
                                    if (ans.equalsIgnoreCase("N")) {
                                        System.out.println("Cancelled");
                                        break;
                                    }
                                    query = "exec delacc ?";
                                    pst = conn.prepareStatement(query);
                                    pst.setString(1, uid);
                                    pst.executeUpdate();
                                    System.out.println("Successfully deleted");
                                    login = false;
                                    break;
                                case 8:
                                    rs = st.executeQuery("select * from visitor where visitor_id=" + uid);
                                    while (rs.next()) {
                                        System.out.println("Old Full name : " + rs.getString(2));
                                        System.out.println("New Full name (- for skip) : ");
                                        al.add(scan.nextLine());
                                        if (al.get(0).equals("-"))
                                            al.set(0, rs.getString(2));
                                        System.out.println("Old phone number : " + rs.getString(3));
                                        System.out.println("New phone number (- for skip) : ");
                                        al.add(scan.nextLine());
                                        if (al.get(1).equals("-"))
                                            al.set(1, rs.getString(3));
                                        System.out.println("Old email : " + rs.getString(4));
                                        System.out.println("New email (- for skip) : ");
                                        al.add(scan.nextLine());
                                        if (al.get(2).equals("-"))
                                            al.set(2, rs.getString(4));
                                    }
                                    query = "exec chvis ?,?,?,?";
                                    pst = conn.prepareStatement(query);
                                    pst.setString(1, uid);
                                    pst.setString(2, al.get(0));
                                    pst.setString(3, al.get(1));
                                    pst.setString(4, al.get(2));
                                    pst.executeUpdate();
                                    System.out.println("Successfully edited");
                                    break;
                                case 9:
                                    rs = st.executeQuery("select username,password from visitor where visitor_id=" + uid);
                                    while (rs.next()) {
                                        un = rs.getString(1);
                                        pw = rs.getString(2);
                                    }
                                    System.out.println("Old username : " + un);
                                    System.out.print("New username : ");
                                    al.add(scan.nextLine());
                                    System.out.print("Enter your password : ");
                                    al.add(scan.nextLine());
                                    if (!pw.equals(al.get(1))) {
                                        System.out.println("Incorrect password, please try again");
                                        break;
                                    }
                                    pst = conn.prepareStatement("exec chuname ?,?");
                                    pst.setString(1, uid);
                                    pst.setString(2, al.get(0));
                                    pst.executeUpdate();
                                    System.out.println("Username updated");
                                    break;
                                case 10:
                                    rs = st.executeQuery("select password from visitor where visitor_id=" + uid);
                                    while (rs.next())
                                        pw = rs.getString(1);
                                    System.out.print("Old password : ");
                                    al.add(scan.nextLine());
                                    System.out.print("New password : ");
                                    al.add(scan.nextLine());
                                    System.out.print("Reenter new password : ");
                                    al.add(scan.nextLine());
                                    if (!pw.equals(al.get(0))) {
                                        System.out.println("Incorrect password, please try again");
                                        break;
                                    }
                                    if (!al.get(1).equals(al.get(2))) {
                                        System.out.println("New password does not match, please try again");
                                        break;
                                    }
                                    pst = conn.prepareStatement("exec chpw ?,?");
                                    pst.setString(1, uid);
                                    pst.setString(2, al.get(1));
                                    pst.executeUpdate();
                                    System.out.println("Password updated");
                                    break;
                                case 11:
                                    login = false;
                                    break;
                                case 12:
                                    login = on = false;
                                    break;
                            }
                        } catch (Exception e) {
                            System.err.println(error);
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println(error);
            }
        }
    }
}
