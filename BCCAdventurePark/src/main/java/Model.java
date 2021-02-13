import java.sql.*;

public class Model {
    private final Connection connection;
    private ResultSet resultSet1;
    private ResultSet resultSet2;

    public Model() throws SQLException {
        connection = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/bccadventurepark",
                "root",
                "narukam1");
    }

    public boolean insertVisitorIntoVisitors(String username,
                                             String password,
                                             String fullName) throws SQLException {
        String query = "INSERT INTO visitors (username, password, full_name) " +
                "VALUES (?, ?, ?)";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setString(1, username);
        preparedStatement.setString(2, password);
        preparedStatement.setString(3, fullName);
        int rowCount = preparedStatement.executeUpdate();
        return rowCount != 0;
    }

    public int returnUserIdIfVisitorSuccessfullyLogin(String username,
                                                      String password) throws SQLException {
        String query = "SELECT * FROM visitors WHERE username = ? AND password = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setString(1, username);
        preparedStatement.setString(2, password);
        resultSet1 = preparedStatement.executeQuery();
        if(resultSet1.next()) {
            return resultSet1.getInt("id");
        } else return 0;
    }

    public int returnUserIdIfAdminSuccessfullyLogin(String username,
                                                    String password) throws SQLException {
        String query = "SELECT * FROM admins WHERE username = ? AND password = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setString(1, username);
        preparedStatement.setString(2, password);
        resultSet1 = preparedStatement.executeQuery();
        if(resultSet1.next()) {
            return resultSet1.getInt("id");
        } else return 0;
    }

    private int returnRowCountFromTable(String tableName) throws SQLException {
        String query = "SELECT COUNT(*) FROM " + tableName;
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        resultSet2 = preparedStatement.executeQuery();
        resultSet2.next();
        return resultSet2.getInt(1);
    }

    private int returnColumnCountFromTable(String tableName) throws SQLException {
        String query = "SELECT COUNT(*) " +
                "FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_SCHEMA = 'bccadventurepark' " +
                "AND TABLE_NAME = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setString(1, tableName);
        resultSet2 = preparedStatement.executeQuery();
        resultSet2.next();
        return resultSet2.getInt(1);
    }

    private String[][] resultSetTo2DArray(String tableName,
                                          ResultSet resultSet) throws SQLException {
        int rowCount = returnRowCountFromTable(tableName);
        int columnCount = returnColumnCountFromTable(tableName);
        String[][] array = new String[rowCount][columnCount];

        int i = 0;
        while(resultSet.next()) {
            int j = 0;
            array[i][j] = resultSet.getString(j + 1);
            while((j + 1) != columnCount) {
                j++;
                array[i][j] = resultSet.getString(j + 1);
            }
            i++;
        }

        return array;
    }

    public String[][] returnAllFromParks() throws SQLException {
        String query = "SELECT * FROM parks";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        resultSet1 = preparedStatement.executeQuery();

        return resultSetTo2DArray("parks", resultSet1);
    }

    public int returnAccountBalance(int userId) throws SQLException {
        String query = "SELECT balance FROM visitors WHERE id = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setInt(1, userId);
        resultSet1 = preparedStatement.executeQuery();
        resultSet1.next();
        return resultSet1.getInt(1);
    }

    public boolean updateBalanceOfVisitor(int userId, int temporaryBalance) throws SQLException {
        String query = "UPDATE visitors SET balance = ? WHERE id = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setInt(1, temporaryBalance);
        preparedStatement.setInt(2, userId);
        int rowCount = preparedStatement.executeUpdate();
        return rowCount != 0;
    }

    public String[][] returnAllFromVisitorsWhereIdEqualsCondition(int condition) throws SQLException {
        String query = "SELECT * FROM visitors WHERE id = ?" ;
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setInt(1, condition);
        resultSet1 = preparedStatement.executeQuery();

        return resultSetTo2DArray("visitors", resultSet1);
    }

    public boolean deleteVisitorFromVisitorsWhereIdEqualsCondition(int condition) throws SQLException {
        String query = "DELETE FROM visitors WHERE id = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setInt(1, condition);
        int rowCount = preparedStatement.executeUpdate();
        return rowCount != 0;
    }

    public boolean updateFullNameOfVisitor(int userId, String fullName) throws SQLException {
        String query = "UPDATE visitors SET full_name = ? WHERE id = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setString(1, fullName);
        preparedStatement.setInt(2, userId);
        int rowCount = preparedStatement.executeUpdate();
        return rowCount != 0;
    }

    public boolean insertParkIntoParks(String name, int price) throws SQLException {
        String query = "INSERT INTO parks (name, price) VALUES (?, ?)";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setString(1, name);
        preparedStatement.setInt(2, price);
        int rowCount = preparedStatement.executeUpdate();
        return rowCount != 0;
    }

    public int returnIdFromParksWhereNameAndPriceEqualConditions(String condition1,
                                                                 int condition2) throws SQLException {
        String query = "SELECT id FROM parks WHERE name = ? AND price = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setString(1, condition1);
        preparedStatement.setInt(2, condition2);
        resultSet1 = preparedStatement.executeQuery();
        if(resultSet1.next()) {
            return resultSet1.getInt("id");
        } else return 0;
    }

    public boolean updateParksWhereIdEqualsCondition(String name, int price, int id) throws SQLException {
        String query = "UPDATE parks SET name = ?, price = ? WHERE id = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setString(1, name);
        preparedStatement.setInt(2, price);
        preparedStatement.setInt(3, id);
        int rowCount = preparedStatement.executeUpdate();
        return rowCount != 0;
    }

    public boolean deleteParkFromParksWhereIdEqualsCondition(int condition) throws SQLException {
        String query = "DELETE FROM parks WHERE id = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setInt(1, condition);
        int rowCount = preparedStatement.executeUpdate();
        return rowCount != 0;
    }

}
