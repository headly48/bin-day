import { Collection, Db } from "mongodb";
import { loadNSWLGA } from "./nsw/data-loader";

export const loadData = async (db: Db) => {
  const collection = db.collection("lgas");

  await loadNSWLGA(collection);
};

export type Geometry = {
  type: "Polygon" | "Point";
  coordinates: [lat: number, long: number][] | [lat: number, long: number];
};
