module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    companyName: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'company_name'
    },
    shortName: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'short_name'
    },
    clientNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      field: 'client_number'
    },
    clientTypeCode: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'client_type_code'
    },
    reasonCode: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'reason_code'
    },
    reason: {
      type: Sequelize.STRING,
      allowNull: true
    },
    institutionCode: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'institution_code'
    },
    branch: {
      type: Sequelize.STRING,
      allowNull: true
    },
    clientCategory: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'client_category'
    },
    productCategory: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'product_category'
    },
    status: {
      type: Sequelize.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    contractsCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      field: 'contracts_count'
    }
  }, {
    timestamps: true,
    tableName: 'customers',
    underscored: true
  });

  return Customer;
}; 