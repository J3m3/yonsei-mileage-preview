# yonsei-mileage-preview

스크립트를 크롬 확장 프로그램을 통해 주입해 마일리지 수강 신청 결과를 조회합니다.

- 수강 신청 결과는 `F12` 단축키를 통해 열 수 있는 개발자 도구의 콘솔에서 확인할 수 있습니다.
- URL 패턴이 `https://underwood1.yonsei.ac.kr/*`과 매칭될 때만 스크립트가 동작합니다.

## Installation

### Direct Injection

1. 브라우저 콘솔에 `injected.js` 파일의 내용을 붙여넣고 실행합니다.

### Via Chrome Extension

1. 본 레포지토리를 `git clone`하거나, 다운로드 후 압축을 풀어줍니다. 압축 해제 후 디렉토리 구조는 아래와 같습니다.

```txt
yonsei-mileage-preview
├── README.md
├── images
│   └── sample.png
├── inject.js
├── injected.js
└── manifest.json
```

2. 크롬을 실행한 뒤 [chrome://extensions/](chrome://extensions/)로 이동합니다.
3. 오른쪽 상단의 `개발자 모드`를 켜 줍니다.
4. 상단 툴바의 `압축해제된 확장 프로그램을 로드합니다.`를 클릭한 뒤, `yonsei-mileage-preview` 디렉토리를 선택합니다.
5. 확장 프로그램을 활성화합니다. (URL 패턴이라는 제한이 걸려 있긴 하나, 마일리지 결과를 조회할 때만 사용할 것을 권합니다)

## Sample Image

![sample](images/sample.png)

## 주입되는 스크립트 ([injected.js](injected.js))

```js
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
```
