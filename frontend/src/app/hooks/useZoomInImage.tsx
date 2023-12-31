import {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
} from "react";
import Stack from "@mui/material/Stack";

type ProviderProps = {
  children: ReactNode;
};

const initialState = {
  imageUrl: "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setImageUrl: (url: string) => {},
};

export const ZoomInImageContext = createContext(initialState);

function useZoomInImage() {
  return useContext(ZoomInImageContext);
}

const ZoomInImageProvider = ({ children }: ProviderProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const imageRef = useRef<HTMLElement>();

  useEffect(() => {
    if (imageUrl) document.addEventListener("click", clickOutside, true);
    return () => {
      document.removeEventListener("click", clickOutside, true);
    };
  }, [imageUrl]);

  const clickOutside = (e: MouseEvent) => {
    if (
      !imageRef?.current?.contains(e.target as HTMLElement) ||
      e.target === imageRef.current
    ) {
      setImageUrl("");
    }
  };

  return (
    <ZoomInImageContext.Provider value={{ imageUrl, setImageUrl }}>
      {children}
      {imageUrl && (
        <Stack
          sx={{
            position: "absolute",
            top: "0",
            height: "100vh",
            width: "100vw",
            zIndex: "100",
            backgroundColor: "rgba(0, 0, 0, .8)",
          }}
          justifyContent="center"
          alignItems="center"
        >
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <img
            src={imageUrl}
            alt="zoom-in-image"
            style={{ maxHeight: "80vh" }}
            {...(imageUrl
              ? {
                  ref: imageRef,
                }
              : {})}
          ></img>
        </Stack>
      )}
    </ZoomInImageContext.Provider>
  );
};

export { ZoomInImageProvider, useZoomInImage };
