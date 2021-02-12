import java.sql.*;

public class Model {
    private final Statement statement1;
    private final Statement statement2;
    private ResultSet resultSet1;
    private ResultSet resultSet2;
    private String sql;

    public Model() throws SQLException {
        Connection connection = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/bccadventurepark",
                "root",
                "narukam1");
        statement1 = connection.createStatement();
        statement2 = connection.createStatement();
    }

    public int returnRowCountFromTable(String tableName) throws SQLException {
        sql = "SELECT COUNT(*) FROM " + tableName;
        resultSet2 = statement2.executeQuery(sql);
        resultSet2.next();
        return resultSet2.getInt(1);
    }

    public int returnColumnCountFromTable(String tableName) throws SQLException {
        sql = "SELECT COUNT(*) " +
                "FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_SCHEMA = 'bccadventurepark' " +
                "AND TABLE_NAME = '" + tableName + "'";
        resultSet2 = statement2.executeQuery(sql);
        resultSet2.next();
        return resultSet2.getInt(1);
    }

    public String[] resultSetTo1DArray(String tableName,
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

    public String[][] resultSetTo2DArray(String tableName,
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

    public String[][] returnAllFromTable(String tableName) throws SQLException {
        sql = "select * from " + tableName;
        resultSet1 = statement1.executeQuery(sql);

        return resultSetTo2DArray(tableName, resultSet1);
    }

    public String[] returnColumnFromTable(String columnName, String tableName) throws SQLException {
        sql = "select " + columnName + " from " + tableName;
        resultSet1 = statement1.executeQuery(sql);

        return resultSetTo1DArray(tableName, resultSet1);
    }

}
