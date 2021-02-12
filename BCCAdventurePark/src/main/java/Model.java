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

    private int returnRowCountFromTable(String tableName) throws SQLException {
        String query = "SELECT COUNT(*) FROM ?";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setString(1, tableName);
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

    private String[] resultSetTo1DArray(String tableName,
                                        ResultSet resultSet) throws SQLException {
        int rowCount = returnRowCountFromTable(tableName);
        String[] array = new String[rowCount];

        int i = 0;
        while(resultSet.next()) {
            array[i] = resultSet.getString(1);
            i++;
        }
        return array;
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

    public String[][] returnAllFromTable(String tableName) throws SQLException {
        String query = "SELECT * FROM ?";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setString(1, tableName);
        resultSet1 = preparedStatement.executeQuery();

        return resultSetTo2DArray(tableName, resultSet1);
    }

    public String[][] returnAllFromTableWhereColumnEqualsCondition(String tableName,
                                                                   String columnName,
                                                                   String condition) throws SQLException {
        String query = "SELECT * FROM ? WHERE ? = ?" ;
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setString(1, tableName);
        preparedStatement.setString(2, columnName);
        preparedStatement.setString(3, condition);
        resultSet1 = preparedStatement.executeQuery();

        return resultSetTo2DArray(tableName, resultSet1);
    }

    public String[] returnColumnFromTable(String columnName, String tableName) throws SQLException {
        String query = "SELECT ? FROM ?";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setString(1, columnName);
        preparedStatement.setString(2, tableName);
        resultSet1 = preparedStatement.executeQuery();

        return resultSetTo1DArray(tableName, resultSet1);
    }

}
