export type LocalGovernmentAreaData = {
  LocalGovernmentArea: {
    type: "FeatureCollection";
    features: LocalGovernmentAreaFeature[];
  };
};

export type LocalGovernmentAreaFeature = {
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: [lat: number, long: number][];
  };
  properties: {
    rid: 63;
    startdate: string;
    enddate: string;
    lastupdate: string;
    msoid: 74;
    centroidid: null;
    shapeuuid: string;
    changetype: string;
    processstate: null;
    urbanity: string;
    Shape__Length: number;
    Shape__Area: number;
    cadid: number;
    createdate: string;
    modifieddate: string;
    lganame: string;
    councilname: string;
    abscode: number;
    ltocode: number;
    vgcode: number;
    wbcode: null;
  };
};
