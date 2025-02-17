async function paginatedFetch(fetchFn, params) {
    let allData = [];
    let startTime = params.startTime;
    
    while (true) {
      const data = await fetchFn({ ...params, startTime });
      if (data.length === 0) break;
      
      allData = [...allData, ...data];
      startTime = data[data.length - 1].time + 1;
      
      if (allData.length >= params.limit) break;
    }
    
    return allData.slice(0, params.limit);
  }