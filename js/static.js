var _myRole = sessionStorage.getItem("Role");
var _unm = sessionStorage.getItem("_mqttUid");
var _pwd = sessionStorage.getItem("_mqttpwd");
var _wsbroker = "pmkbroker.hkapl.in";
var _wsport = 80;
var useSLL = true;
var _uId = sessionStorage.getItem("UserId");
var _decimalPointN = 2;
var _startYear = 2019;
var _stateCenterLatitude = 21.2514;
var _stateCenterLongitude = 81.6296;
var _sitesGroupMaster = [];
var _orgGMaster;
var _solarDeviceList = [];
var _ssDeviceList = [];
var _devicesGMaster = [];
var _pageGroupMaster = [];
var _orgId;
var _sId;
var statesSelectedArrayTmp = [22,6,2,20,24,29,23,27,14,17,15,21,8,3,33,16,9,1];
var _masterTrendData = [
  {
    suffix: "VRN",
    yaxis: 0,
    color: "green",
    min: "",
    max: "",
    contant: "VOLTAGE",
    unit: "V"
  },
  {
    suffix: "VYN",
    yaxis: 0,
    color: "#004000",
    min: "",
    max: "",
    contant: "VOLTAGE",
    unit: "V"
  },
  {
    suffix: "VBN",
    yaxis: 0,
    color: "red",
    min: "",
    max: "",
    contant: "VOLTAGE",
    unit: "V"
  },
  {
    suffix: "VN",
    yaxis: 0,
    color: "red",
    min: "",
    max: "",
    contant: "VOLTAGE",
    unit: "V"
  },
  {
    suffix: "IR",
    yaxis: 2,
    color: "#ff5500",
    min: "",
    max: "",
    contant: "CURRENT",
    unit: "A"
  },
  {
    suffix: "IY",
    yaxis: 2,
    color: "#0099ff",
    min: "",
    max: "",
    contant: "CURRENT",
    unit: "A"
  },
  {
    suffix: "IB",
    yaxis: 2,
    color: "#8c1aff",
    min: "",
    max: "",
    contant: "CURRENT",
    unit: "A"
  },
  {
    suffix: "IP",
    yaxis: 2,
    color: "#8c1aff",
    min: "",
    max: "",
    contant: "CURRENT",
    unit: "A"
  },
  {
    suffix: "POWR",
    yaxis: 3,
    color: "#0B4F4B",
    min: "",
    max: "",
    contant: "POWER",
    unit: "kW"
  },
  {
    suffix: "POWY",
    yaxis: 3,
    color: "#8f8881",
    min: "",
    max: "",
    contant: "POWER",
    unit: "kW"
  },
  {
    suffix: "POWB",
    yaxis: 3,
    color: "#11661E",
    min: "",
    max: "",
    contant: "POWER",
    unit: "kW"
  },
  {
    suffix: "POW",
    yaxis: 3,
    color: "#7F2DDC",
    min: "",
    max: "",
    contant: "POWER",
    unit: "kW"
  },
  {
    suffix: "-Total-kVAr",
    yaxis: 3,
    color: "#008080",
    min: "",
    max: "",
    contant: "POWER",
    unit: "kVAr"
  },
  {
    suffix: "-TotalkVA",
    yaxis: 3,
    color: "#7e2e19",
    min: "",
    max: "",
    contant: "POWER",
    unit: "kVA"
  },
  {
    suffix: "-Avg-PF",
    yaxis: 4,
    color: "#5e4b3c",
    min: "",
    max: "",
    contant: "PF",
    unit: "-"
  },
  {
    suffix: "PF",
    yaxis: 4,
    color: "#5e4b3c",
    min: "",
    max: "",
    contant: "PF",
    unit: "-"
  },
  {
    suffix: "PFR",
    yaxis: 4,
    color: "#EA7271",
    min: "",
    max: "",
    contant: "PF",
    unit: "-"
  },
  {
    suffix: "PFY",
    yaxis: 4,
    color: "#0B90A3",
    min: "",
    max: "",
    contant: "PF",
    unit: "-"
  },
  {
    suffix: "PFB",
    yaxis: 4,
    color: "#CC7507",
    min: "",
    max: "",
    contant: "PF",
    unit: "-"
  },
  {
    suffix: "KWHIMP",
    yaxis: 5,
    color: "#6479F2",
    min: "",
    max: "",
    contant: "Other",
    unit: "KWH"
  },
  {
    suffix: "POFF",
    yaxis: 5,
    color: "#F52B34",
    min: "",
    max: "",
    contant: "Other",
    unit: "minutes"
  },
  {
    suffix: "-Total-kWh",
    yaxis: 5,
    color: "#FF3364",
    min: "",
    max: "",
    contant: "Other",
    unit: "-"
  },
  {
    suffix: "KWH",
    yaxis: 5,
    color: "#FF3364",
    min: "",
    max: "",
    contant: "Other",
    unit: "KWH"
  },
  {
    suffix: "Device Connectivity",
    yaxis: 5,
    color: "#9451A5",
    min: "",
    max: "",
    contant: "Other",
    unit: "-"
  }
];
var _solarGrpList = [];
var _alarmType = [
  {
    name: "Normal",
    value: "0"
  },
  {
    name: "HH",
    value: "1"
  },
  {
    name: "H",
    value: "2"
  },
  {
    name: "L",
    value: "3"
  },
  {
    name: "LL",
    value: "4"
  },
  {
    name: "DigitalOn",
    value: "5"
  },
  {
    name: "DigitalOff",
    value: "6"
  }
];
var localstorage1 = sessionStorage.getItem("_token");

var _GroupTypeMaster = [
  { groupType: "instantaneous", enum: "1" },
  { groupType: "notification", enum: "2" },
  { groupType: "map", enum: "3" },
  { groupType: "heartbeat", enum: "4" }
];

var _MyDeviceCategory = [
  {
    mKey: "SOLAR",
    mVal: "MC"
  },
  {
    mKey: "WDD",
    mVal: "WDD"
  },
  {
    mKey: "WDTCA",
    mVal: "WDTA"
  },
  {
    mKey: "WDTC",
    mVal: "WDT"
  },
  {
    mKey: "NAG",
    mVal: "NAG"
  },
  {
    mKey: "NAG3P",
    mVal: "NAG3P"
  },
  {
    mKey: "FEEDER",
    mVal: "FEEDER"
  }
];

var _MyCategoryMaster = [
  {
    mKey: "SOLAR",
    mVal: "Solar"
  },
  {
    mKey: "WDD",
    mVal: "WDD"
  },
  {
    mKey: "WDT",
    mVal: "WDT"
  },
  {
    mKey: "WDTC",
    mVal: "WDTC"
  },
  {
    mKey: "NAG",
    mVal: "NAG"
  },
  {
    mKey: "FEEDER",
    mVal: "FEEDER"
  }
];

var spellEnums = [
  {
    mKey: "AGRICULTURE",
    mVal: "Agricultural"
  }
];

var _MyConsumerCategory = [
  {
    mKey: "AGRICULTURE",
    mVal: "Agriculture"
  },
  {
    mKey: "RESIDENTIAL",
    mVal: "Residential"
  },
  {
    mKey: "NRGP",
    mVal: "NRGP"
  },
  {
    mKey: "LTMD",
    mVal: "LTMD"
  },
  {
    mKey: "STREETLIGHT",
    mVal: "Street Light"
  },
  {
    mKey: "WATERWORKS",
    mVal: "Water Workks"
  },
  {
    mKey: "GLP",
    mVal: "GLP"
  }
];

var _MyMeterCategory = [
  {
    mKey: "SINGLEPHRASE",
    mVal: "Single Phase"
  },
  {
    mKey: "THREEPHASE200/5",
    mVal: "Three Phase 200/5"
  },
  {
    mKey: "THREEPHASE10/60",
    mVal: "Three Phase 10/60"
  },
  {
    mKey: "THREEPHASE100/5",
    mVal: "Three Phase 100/5"
  }
];
var statusJson = {
  Result: {
    Flag: true,
    Message: "string"
  },
  Data: [
    {
      Id: "1",
      Name: "Application Registration",
      displayName: "Application Registration",
      sortName: "reg"
    },
    {
      Id: "2",
      Name: "Farmer Aadhar Authentication",
      displayName: "Farmer Aadhar Authentication",
      sortName: "auth"
    },
    {
      Id: "3",
      Name: "Site Survey",
      displayName: "Site Survey",
      sortName: "survey"
    },
    {
      Id: "4",
      Name: "Application Acceptance after Site Survey",
      displayName: "Application Acceptance after Site Survey",
      sortName: "aceept"
    },
    {
      Id: "5",
      Name: "Payment Receipt from Farmer",
      displayName: "Payment Receipt from Farmer",
      sortName: "cpaymnt"
    },
    {
      Id: "6",
      Name: "Order Receipt to Vendor",
      displayName: "Order Receipt to Vendor",
      sortName: "order"
    },
    {
      Id: "7",
      Name: "Asset Checklist with Documents",
      displayName: "Asset Checklist with Documents",
      sortName: "asset"
    },
    {
      Id: "7",
      Name: "Asset Documents Verification",
      displayName: "Asset Documents Verification",
      sortName: "asset"
    },
    {
      Id: "7",
      Name: "On Hold",
      displayName: "On Hold",
      sortName: "asset"
    },
    {
      Id: "8",
      Name: "PDI",
      displayName: "PDI",
      sortName: "inspect"
    },
    {
      Id: "9",
      Name: "Dispatch",
      displayName: "Dispatch",
      sortName: "dispatch"
    },
    {
      Id: "10",
      Name: "Installation & Commission",
      displayName: "Installation & Commission",
      sortName: "inst"
    },
    // {
    //   Id: "11",
    //   Name: "Commissioned",
    //   displayName: "Commissioned",
    //   sortName: "comm"
    // },
    {
      Id: "12",
      Name: "Site Inspection",
      displayName: "Site Inspection",
      sortName: "siteinsp"
    },
    {
      Id: "13",
      Name: "State Payment Received",
      displayName: "State Payment Received",
      sortName: "spaymnt"
    },
    {
      Id: "14",
      Name: "Central Payment Received",
      displayName: "Central Payment Received",
      sortName: "csubsidy"
    }
  ]
};
var _statusJson= [
 
];
//performance Dashboard
var uuidArray = ["KWHIMP1", "KWHIMP2", "KWHIMP3", "CUF", "PMPHR", "WATEROP", "COMMUP", "DA","KWHIMP4","KWHIMP5","KWHEXP1","DA2","DA3","INVHR","HVHR","LPHR","NET","DTIME","INCOME"];


var _componentObj = {
  a: 1,
  b: 2,
  c: 3,
};
var Master_AssetLocation = {
  SiteLocation: 1,
  FieldServiceEngineer: 2,
  AgencyStoreUnderInspection: 3,
  AgencyStore: 4,
  ManufacturerStore: 5,
  ManufacturerService: 6,
  CustomerLab1: 7,
  CustomerStore: 8,
};

var Master_AssetType = {
  PUMP: 1,
  RMS: 2,
  SolarPanel: 3,
  PumpController: 4,
  SolarStructure: 5
};

var Master_AssetStatus = {
  1: "Active",
  2: "Repaired",
  3: "Defective",
  4: "NonRepairable",
  5: "New",
  6: "Fired"
};

var ICSubStatus = {
  "Foundation": 1,
  "Structure": 2,
  "PVSystemAndController": 3,
  "SiteInspectionCompleted": 4,
  "CommisioningAndGoLive": 5
};

var _pumpCapacity = {
  0: "1",
  1: "2",
  2: "3",
  3: "5",
  4: "7.5",
  5: "10",
};
var _pumpCapacityTicks=Object.values(_pumpCapacity).map((el,i)=>[i*2,el+"HP"]);