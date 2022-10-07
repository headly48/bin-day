import Fs from "fs/promises";
import { Collection } from "mongodb";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require("node-fetch");
import winston from "winston";
import { Geometry } from "../data-loader";
import { LocalGovernmentAreaData } from "./lga/LocalGovernmentArea";

export const loadNSWLGA = async (collection: Collection) => {
  const deleteResults = await collection.deleteMany({ state: "NSW" });

  winston.log("info", `Deleted ${deleteResults.deletedCount} NSW LGA RECORDS`);

  const json = await Fs.readFile(
    __dirname + "/lga/LocalGovernmentArea_EPSG4326.json",
    {
      encoding: "utf-8",
    }
  );

  const nswLGAData: LocalGovernmentAreaData = JSON.parse(json);

  const lgaRecords = nswLGAData.LocalGovernmentArea.features.map(
    (lgaFeature) => {
      return {
        state: "NSW",
        geometry: {
          ...lgaFeature.geometry,
        },
        ...lgaFeature.properties,
      };
    }
  );

  const results = await collection.insertMany(lgaRecords);
  winston.log("info", `Added ${results.insertedCount} NSW LGA RECORDS`);

  addPenrithCollectionZones(collection);
};

type PenrithData = {
  records: {
    fields: {
      free_text: string;
      geo_shape: Geometry;
      geo_point_2d: [lat: number, long: number];
      collection_day:
        | "Tuesday"
        | "Thursday"
        | "Monday"
        | "Wednesday"
        | "Friday"
        | "Collect_Return";
      day:
        | "Tuesday"
        | "Thursday"
        | "Monday"
        | "Wednesday"
        | "Friday"
        | "Collect_Return";
      council: "Penrith City Council";
      indicative_suburb: "ST MARYS";
      bin_collection_code: "CR1";
      bin_collection_desc: "Bin Collection Area - Collect & Return Zone 1";
    };
  }[];
};

type Bin = {
  isFortnightlyEven?: boolean;
  schedule: 1 | 2; // 1 = Weekly, 2 = Fortnightly
  collectionDay: 0 | 1 | 2 | 3 | 4 | 5 | 6[]; // 0 = Monday
  colour: "Light Green" | "Yellow" | "Red";
};

type CollectionZone = {
  geometry: Geometry;
  collectionCode: string;
  bins: Bin[];
};

// Penrith data
// https://www.penrithcity.nsw.gov.au/waste-environment/waste/waste-collection-schedules
// https://data.penrith.city/explore/dataset/bincollectioncodes_sep20/information/?rows=-1
export const addPenrithCollectionZones = async (collection: Collection) => {
  const result = await collection
    .find({
      lganame: "PENRITH",
      state: "NSW"
    })
    .toArray();

  if (result.length != 1) {
    throw new Error(`PENRITH LGA NOT FOUND OR MULTIPLE, count: ${result.length}`);
  }

  const res = await fetch(
    "https://data.penrith.city/api/records/1.0/search/?dataset=bincollectioncodes_sep20&q=&rows=1&facet=collection_day"
  );

  const data: PenrithData = (await res.json()) as PenrithData;

  const zones: CollectionZone[] = data.records.map((record) => {
    const bins: Bin[] = [];

    return {
      geometry: record.fields.geo_shape,
      collectionCode: record.fields.bin_collection_code,
      bins,
    };
  });
  console.log(data);

//   result[0].collectionZones = zones;

  await collection.updateOne({
    lganame: "PENRITH",
    state: "NSW"
  }, { $set: { collectionZones: zones } });

  // fetch()
  // https://data.penrith.city/api/records/1.0/search/?dataset=bincollectioncodes_sep20&q=&rows=-1&facet=collection_day
};
