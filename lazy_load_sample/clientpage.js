// Trong ClientsPage.js
const fetchOracleClients = async (pageNum = page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/oracle/clients?page=${pageNum}&itemsPerPage=${itemsPerPageOracle}`
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      const data = await response.json();
      const { clients, totalItems, totalPages } = data.data;
  
      setClients(clients);
      setPageData({ [pageNum]: clients });
      setLoadedPages(new Set([pageNum]));
      // Cập nhật totalPagesOracle từ server
      // Bạn cần thêm state mới cho totalPages nếu chưa có
      setTotalPages(totalPages); // Giả sử bạn thêm state này
  
      return clients;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
    if (!loadedPages.has(pageNumber)) {
      fetchOracleClients(pageNumber);
    }
  };