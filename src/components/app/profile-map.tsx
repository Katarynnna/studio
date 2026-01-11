
'use client';

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const MissingApiKey = () => (
    <Alert variant="destructive" className="my-4">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Google Maps API Key is Missing</AlertTitle>
      <AlertDescription>
        To display the map, please add your Google Maps API key to your environment variables.
      </AlertDescription>
    </Alert>
);

const ProfileMap = ({ position }: { position: { lat: number; lng: number }}) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return <MissingApiKey />;

    return (
        <div className='aspect-video w-full rounded-lg overflow-hidden my-4 border'>
            <APIProvider apiKey={apiKey}>
                <Map
                    center={position}
                    defaultZoom={9}
                    mapId="profile_map"
                    disableDefaultUI={true}
                    gestureHandling="none"
                >
                    <AdvancedMarker position={position}>
                         <div className="w-6 h-6 rounded-full bg-primary border-2 border-white shadow-lg"></div>
                    </AdvancedMarker>
                </Map>
            </APIProvider>
        </div>
    )
}

export default ProfileMap;
