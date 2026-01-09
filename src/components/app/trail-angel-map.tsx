"use client";

import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import type { TrailAngel } from "@/lib/types";
import { TRAILS } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import React, { useEffect, useState } from "react";

type TrailAngelMapProps = {
  angels: TrailAngel[];
  onSelectAngel: (angel: TrailAngel) => void;
};

const MissingApiKey = () => (
  <div className="flex items-center justify-center h-full bg-muted">
    <Alert variant="destructive" className="max-w-md">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Google Maps API Key is Missing</AlertTitle>
      <AlertDescription>
        To display the map, please add your Google Maps API key as an environment variable.
        <br />
        Create a <code className="font-code text-sm relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-semibold">.env.local</code> file and add:
        <br />
        <pre className="font-code mt-2">
          NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY"
        </pre>
      </AlertDescription>
    </Alert>
  </div>
);

const Polyline = (props: google.maps.PolylineOptions) => {
  const map = useMap();
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (map) {
      const poly = new google.maps.Polyline({
        ...props,
        map: map,
      });
      setPolyline(poly);

      return () => {
        poly.setMap(null);
      };
    }
  }, [map, props]);

  return null;
};


export default function TrailAngelMap({ angels, onSelectAngel }: TrailAngelMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <MissingApiKey />;
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={{ lat: 39.8283, lng: -98.5795 }}
        defaultZoom={4}
        mapId="trail_angel_hub_map"
        disableDefaultUI={true}
        gestureHandling="greedy"
      >
        <Polyline
          path={TRAILS.pct.track}
          strokeColor={TRAILS.pct.color}
          strokeOpacity={0.8}
          strokeWeight={3}
        />
        <Polyline
          path={TRAILS.at.track}
          strokeColor={TRAILS.at.color}
          strokeOpacity={0.8}
          strokeWeight={3}
        />
        <Polyline
          path={TRAILS.cdt.track}
          strokeColor={TRAILS.cdt.color}
          strokeOpacity={0.8}
          strokeWeight={3}
        />
        {angels.map((angel) => (
          <AdvancedMarker
            key={angel.id}
            position={angel.position}
            onClick={() => onSelectAngel(angel)}
            title={angel.name}
          >
            <div className="w-6 h-6 rounded-full bg-primary border-2 border-primary-foreground shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
}
