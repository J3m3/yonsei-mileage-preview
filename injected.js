(function () {
  const MILEAGE_RESOURCE = "findMileStdList";
  const COURESE_NAME_KEY = "subjtNm";
  const MILEAGE_RESULT_KEY = "mlgAtnlcTrgetYn";
  const MILEAGE_RANK_KEY = "mlgRank";
  const KEY_MAP = {
    [COURESE_NAME_KEY]: `강의명(${COURESE_NAME_KEY})`,
    [MILEAGE_RESULT_KEY]: `마일리지 신청 결과(${MILEAGE_RESULT_KEY})`,
    [MILEAGE_RANK_KEY]: `마일리지 순위(${MILEAGE_RANK_KEY})`,
  };
  let fetched = false;

  function processResponse(responseText) {
    const response = JSON.parse(responseText);
    const mileageResults = Object.values(response)[0];
    return mileageResults.map((result) =>
      Object.entries(result).reduce((acc, [key, val]) => ({
        ...acc,
        [KEY_MAP[key] ?? key]: val,
      }))
    );
  }

  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    this.addEventListener("load", function () {
      if (url.includes(MILEAGE_RESOURCE) && !fetched) {
        const mileageResults = processResponse(this.responseText);
        console.table(mileageResults, [
          KEY_MAP[COURESE_NAME_KEY],
          KEY_MAP[MILEAGE_RESULT_KEY],
          KEY_MAP[MILEAGE_RANK_KEY],
        ]);
        fetched = true;
      }
    });
    originalOpen.apply(this, [method, url, ...args]);
  };
})();
