const { getConnection, closeConnection } = require('../../config/oracle.config');
const { formatOracleResult, handleOracleError } = require('../../utils/oracle.helper');

// Kiểm tra contract có tồn tại không
async function checkContractExists(contractId) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT COUNT(*) AS count FROM ACNT_CONTRACT WHERE ID = :contractId AND AMND_STATE = 'A'`,
      { contractId }
    );
    const count = formatOracleResult(result)[0].COUNT;
    return count > 0;
  } catch (err) {
    console.error('Error checking contract existence:', err);
    throw handleOracleError(err);
  } finally {
    await closeConnection(connection);
  }
}

// Lấy các hợp đồng cấp cao nhất (Liability) có phân trang
async function getTopLevelContracts(page = 1, itemsPerPage = 10) {
  let connection;
  try {
    connection = await getConnection();

    // Tính offset
    const offset = (page - 1) * itemsPerPage;

    // Đếm tổng số hợp đồng liability
    const countQuery = `
      SELECT COUNT(*) AS total_count FROM ACNT_CONTRACT
      WHERE LIAB_CONTRACT IS NULL AND ACNT_CONTRACT__OID IS NULL AND AMND_STATE = 'A'
    `;

    const countResult = await connection.execute(countQuery, {});
    const totalCount = formatOracleResult(countResult)[0].TOTAL_COUNT;

    // Query chính để lấy dữ liệu có phân trang
    const query = `
      SELECT * FROM ACNT_CONTRACT
      WHERE LIAB_CONTRACT IS NULL AND ACNT_CONTRACT__OID IS NULL AND AMND_STATE = 'A'
      ORDER BY AMND_DATE DESC
      OFFSET :offset ROWS FETCH NEXT :itemsPerPage ROWS ONLY
    `;

    const result = await connection.execute(query, { offset, itemsPerPage });

    const liabilityContracts = formatOracleResult(result);

    return {
      data: liabilityContracts,
      pagination: {
        total: totalCount,
        currentPage: page,
        itemsPerPage: itemsPerPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  } catch (err) {
    console.error('Error fetching top-level contracts from Oracle:', err);
    throw handleOracleError(err);
  } finally {
    await closeConnection(connection);
  }
}

// Lấy các hợp đồng cấp cao nhất (Liability) theo clientId có phân trang
async function getTopLevelContractsByClientId(clientId, page = 1, itemsPerPage = 10) {
  let connection;
  try {
    connection = await getConnection();

    // Tính offset
    const offset = (page - 1) * itemsPerPage;

    // Đếm tổng số hợp đồng liability của clientId
    const countQuery = `
      SELECT COUNT(*) AS total_count FROM ACNT_CONTRACT
      WHERE LIAB_CONTRACT IS NULL 
      AND ACNT_CONTRACT__OID IS NULL 
      AND AMND_STATE = 'A'
      AND CLIENT__ID = :clientId
    `;

    const countResult = await connection.execute(countQuery, { clientId });
    const totalCount = formatOracleResult(countResult)[0].TOTAL_COUNT;

    // Nếu không tìm thấy hợp đồng, thử với TO_CHAR
    if (totalCount === 0) {
      const countCharQuery = `
        SELECT COUNT(*) AS total_count FROM ACNT_CONTRACT
        WHERE LIAB_CONTRACT IS NULL 
        AND ACNT_CONTRACT__OID IS NULL 
        AND AMND_STATE = 'A'
        AND TO_CHAR(CLIENT__ID) = TO_CHAR(:clientId)
      `;
      const countCharResult = await connection.execute(countCharQuery, { clientId });
      const totalCharCount = formatOracleResult(countCharResult)[0].TOTAL_COUNT;

      if (totalCharCount === 0) {
        return {
          data: [],
          pagination: {
            total: 0,
            currentPage: page,
            itemsPerPage: itemsPerPage,
            totalPages: 0,
          },
        };
      }

      // Query chính với TO_CHAR
      const charQuery = `
        SELECT * FROM ACNT_CONTRACT
        WHERE LIAB_CONTRACT IS NULL 
        AND ACNT_CONTRACT__OID IS NULL 
        AND AMND_STATE = 'A'
        AND TO_CHAR(CLIENT__ID) = TO_CHAR(:clientId)
        ORDER BY AMND_DATE DESC
        OFFSET :offset ROWS FETCH NEXT :itemsPerPage ROWS ONLY
      `;

      const charResult = await connection.execute(charQuery, { clientId, offset, itemsPerPage });
      const charLiabilityContracts = formatOracleResult(charResult);

      return {
        data: charLiabilityContracts,
        pagination: {
          total: totalCharCount,
          currentPage: page,
          itemsPerPage: itemsPerPage,
          totalPages: Math.ceil(totalCharCount / itemsPerPage),
        },
      };
    }

    // Query chính để lấy dữ liệu có phân trang
    const query = `
      SELECT * FROM ACNT_CONTRACT
      WHERE LIAB_CONTRACT IS NULL 
      AND ACNT_CONTRACT__OID IS NULL 
      AND AMND_STATE = 'A'
      AND CLIENT__ID = :clientId
      ORDER BY AMND_DATE DESC
      OFFSET :offset ROWS FETCH NEXT :itemsPerPage ROWS ONLY
    `;

    const result = await connection.execute(query, { clientId, offset, itemsPerPage });

    const liabilityContracts = formatOracleResult(result);

    return {
      data: liabilityContracts,
      pagination: {
        total: totalCount,
        currentPage: page,
        itemsPerPage: itemsPerPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  } catch (err) {
    console.error('Error fetching top-level contracts by client ID from Oracle:', err);
    throw handleOracleError(err);
  } finally {
    await closeConnection(connection);
  }
}

// Lấy các Issue Contracts của một Liability Contract
async function getIssueContracts(parentContractId) {
  let connection;
  try {
    connection = await getConnection();

    // Kiểm tra parentContractId tồn tại
    const exists = await checkContractExists(parentContractId);
    if (!exists) {
      throw new Error(`Parent contract with ID ${parentContractId} does not exist`);
    }

    // Lấy tất cả Issue Contracts
    const query = `
      SELECT * FROM ACNT_CONTRACT
      WHERE LIAB_CONTRACT = :parentContractId
      AND ACNT_CONTRACT__OID IS NULL
      AND AMND_STATE = 'A'
      ORDER BY AMND_DATE DESC
    `;

    const result = await connection.execute(query, { parentContractId });
    return formatOracleResult(result);
  } catch (err) {
    console.error('Error fetching issue contracts from Oracle:', err);
    throw handleOracleError(err);
  } finally {
    await closeConnection(connection);
  }
}

// Lấy các Card Contracts của một Issue Contract
async function getCardContracts(parentContractId) {
  let connection;
  try {
    connection = await getConnection();

    // Kiểm tra parentContractId tồn tại
    const exists = await checkContractExists(parentContractId);
    if (!exists) {
      throw new Error(`Parent contract with ID ${parentContractId} does not exist`);
    }

    // Lấy tất cả Card Contracts
    const query = `
      SELECT * FROM ACNT_CONTRACT
      WHERE ACNT_CONTRACT__OID = :parentContractId
      AND (CONTRACT_NUMBER LIKE '10000%' AND LENGTH(CONTRACT_NUMBER) = 16)
      AND AMND_STATE = 'A'
      ORDER BY AMND_DATE DESC
    `;

    const result = await connection.execute(query, { parentContractId });
    return formatOracleResult(result);
  } catch (err) {
    console.error('Error fetching card contracts from Oracle:', err);
    throw handleOracleError(err);
  } finally {
    await closeConnection(connection);
  }
}

// Lấy cây hợp đồng đầy đủ (bao gồm cả Issue và Card Contracts)
async function getFullContractHierarchy(page = 1, itemsPerPage = 10) {
  // Step 1: Lấy các hợp đồng liability (cấp cao nhất)
  const topLevelResult = await getTopLevelContracts(page, itemsPerPage);
  const liabilityContracts = topLevelResult.data;

  // Step 2: Tạo cấu trúc cây đầy đủ
  const hierarchicalContracts = [];

  for (const liability of liabilityContracts) {
    // Tạo node cho Liability Contract
    const liabilityNode = {
      id: liability.ID,
      title: `${liability.CONTRACT_NAME}`,
      type: "liability",
      contractNumber: liability.CONTRACT_NUMBER,
      oracleData: liability, // Lưu toàn bộ dữ liệu từ Oracle
      children: [],
    };

    // Step 3: Lấy Issue Contracts của Liability Contract
    const issueContracts = await getIssueContracts(liability.ID);

    for (const issue of issueContracts) {
      // Tạo node cho Issue Contract
      const issueNode = {
        id: issue.ID,
        title: `${issue.CONTRACT_NAME}`,
        type: "issue",
        contractNumber: issue.CONTRACT_NUMBER,
        oracleData: issue, // Lưu toàn bộ dữ liệu từ Oracle
        children: [],
      };

      // Step 4: Lấy Card Contracts của Issue Contract
      const cardContracts = await getCardContracts(issue.ID);

      // Thêm Card Contracts vào node của Issue Contract
      issueNode.children = cardContracts.map((card) => ({
        id: card.ID,
        title: `${card.CONTRACT_NAME}`,
        type: "card",
        contractNumber: card.CONTRACT_NUMBER,
        oracleData: card, // Lưu toàn bộ dữ liệu từ Oracle
        children: [], // Card Contracts không có con
      }));

      // Thêm Issue Node vào Liability Node
      liabilityNode.children.push(issueNode);
    }

    // Thêm Liability Node vào cây
    hierarchicalContracts.push(liabilityNode);
  }

  return {
    data: hierarchicalContracts,
    pagination: topLevelResult.pagination,
  };
}

// Lấy cây hợp đồng đầy đủ theo clientId (bao gồm cả Issue và Card Contracts)
async function getFullContractHierarchyByClientId(clientId, page = 1, itemsPerPage = 10) {
  // Step 1: Lấy các hợp đồng liability (cấp cao nhất) theo clientId
  const topLevelResult = await getTopLevelContractsByClientId(clientId, page, itemsPerPage);
  const liabilityContracts = topLevelResult.data;

  // Step 2: Tạo cấu trúc cây đầy đủ
  const hierarchicalContracts = [];

  for (const liability of liabilityContracts) {
    // Tạo node cho Liability Contract
    const liabilityNode = {
      id: liability.ID,
      title: `${liability.CONTRACT_NAME}`,
      type: "liability",
      contractNumber: liability.CONTRACT_NUMBER,
      oracleData: liability, // Lưu toàn bộ dữ liệu từ Oracle
      children: [],
    };

    // Step 3: Lấy Issue Contracts của Liability Contract
    const issueContracts = await getIssueContracts(liability.ID);

    for (const issue of issueContracts) {
      // Tạo node cho Issue Contract
      const issueNode = {
        id: issue.ID,
        title: `${issue.CONTRACT_NAME}`,
        type: "issue",
        contractNumber: issue.CONTRACT_NUMBER,
        oracleData: issue, // Lưu toàn bộ dữ liệu từ Oracle
        children: [],
      };

      // Step 4: Lấy Card Contracts của Issue Contract
      const cardContracts = await getCardContracts(issue.ID);

      // Thêm Card Contracts vào node của Issue Contract
      issueNode.children = cardContracts.map((card) => ({
        id: card.ID,
        title: `${card.CONTRACT_NAME}`,
        type: "card",
        contractNumber: card.CONTRACT_NUMBER,
        oracleData: card, // Lưu toàn bộ dữ liệu từ Oracle
        children: [], // Card Contracts không có con
      }));

      // Thêm Issue Node vào Liability Node
      liabilityNode.children.push(issueNode);
    }

    // Thêm Liability Node vào cây
    hierarchicalContracts.push(liabilityNode);
  }

  return {
    data: hierarchicalContracts,
    pagination: topLevelResult.pagination,
  };
}

module.exports = {
  checkContractExists,
  getTopLevelContracts,
  getTopLevelContractsByClientId,
  getIssueContracts,
  getCardContracts,
  getFullContractHierarchy,
  getFullContractHierarchyByClientId,
};