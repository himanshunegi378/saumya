import {
  useMemo,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import "./App.css";
import {
  Box,
  Text,
  Grid,
  GridItem,
  Breadcrumb,
  BreadcrumbItem,
} from "@chakra-ui/react";
import { faFile, faFolder } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { dummyData } from "./dummyData";
import { faHome } from "@fortawesome/free-solid-svg-icons";

interface Material {
  id: string;
  name: string;
  type: "material";
  studies: string[];
}

interface Study {
  id: string;
  name: string;
  type: "study";
  protocols: string[];
}

interface Protocol {
  id: string;
  name: string;
  type: "protocol";
  tests: string[];
}

interface Test {
  id: string;
  name: string;
  type: "test";
  duration: number;
}

export interface Data {
  materials: Material[];
  studies: Study[];
  protocols: Protocol[];
  tests: Test[];
}

interface DirStructure<T> {
  id: string;
  name: string;
  data: T;
  type: "dir" | "file";
  children: DirStructure<T>[];
}

const convertToDirStructure = (
  data: Data
): Array<DirStructure<Material | Study | Protocol | Test>> => {
  const studyMap = new Map(data.studies.map((study) => [study.id, study]));
  const protocolMap = new Map(
    data.protocols.map((protocol) => [protocol.id, protocol])
  );
  const testMap = new Map(data.tests.map((test) => [test.id, test]));

  const materials = data.materials.map((material) => ({
    id: material.id,
    name: material.name,
    data: material,
    type: "dir",
    children: material.studies.map((studyId) => {
      const study = studyMap.get(studyId)!;
      return {
        id: studyId,
        name: study.name,
        data: study,
        type: "dir",
        children: study.protocols.map((protocolId) => {
          const protocol = protocolMap.get(protocolId)!;
          return {
            id: protocolId,
            name: protocol.name,
            data: protocol,
            type: "dir",
            children: protocol.tests.map((testId) => {
              const test = testMap.get(testId)!;
              return {
                id: testId,
                name: test.name,
                data: test,
                type: "file",
                children: [],
              };
            }),
          };
        }),
      };
    }),
  }));

  return materials as Array<DirStructure<Material | Study | Protocol | Test>>;
};

console.log(convertToDirStructure(dummyData));

const FileExplorer = forwardRef<
  {
    getPath: () => string[];
    changePath: (newPath: string[]) => void;
  },
  {
    dirs: Array<DirStructure<Material | Study | Protocol | Test>>;
    render: (
      file: DirStructure<Material | Study | Protocol | Test>,
      next: () => void
    ) => JSX.Element;
    onPathChange?: (path: string[]) => void;
  }
>(({ dirs, render, onPathChange }, ref) => {
  const [path, setPath] = useState<string[]>([]);
  const getFiles = useCallback(
    (
      path: string[],
      dirs: DirStructure<Material | Study | Protocol | Test>[]
    ): DirStructure<Material | Study | Protocol | Test>[] => {
      // recursively get files
      for (const pathItem of path) {
        const dir = dirs.find((dir) => dir.name === pathItem);
        if (dir) {
          if (dir.type === "dir") {
            return getFiles(path.slice(1), dir.children);
          } else {
            return [dir];
          }
        } else {
          return [];
        }
      }
      return dirs;
    },
    []
  );

  useImperativeHandle(ref, () => ({
    getPath: () => path,
    changePath: (newPath: string[]) => {
      setPath(newPath);
      if (onPathChange) {
        onPathChange(newPath);
      }
    },
  }));

  const files = useMemo(() => getFiles(path, dirs), [path, getFiles, dirs]);

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
      {files.map((file) => {
        const next = () => {
          if (file.type === "dir") {
            const newPath = [...path, file.name];
            setPath(newPath);
            if (onPathChange) {
              onPathChange(newPath);
            }
          } else {
            console.log("open file");
          }
        };

        return (
          <GridItem key={path.join("") + file.name} colSpan={1}>
            {render(file, next)}
          </GridItem>
        );
      })}
    </Grid>
  );
});

function App() {
  const [path, setPath] = useState<string[]>([]);
  const fileExplorerRef = useRef<{
    getPath: () => string[];
    changePath: (newPath: string[]) => void;
  }>(null);
  const dirStructure = useMemo(() => convertToDirStructure(dummyData), []);

  const handleBreadcrumbClick = (index: number) => {
    fileExplorerRef.current?.changePath(path.slice(0, index + 1));
  };

  return (
    <Box p={4}>
      <Text fontSize="lg" mb={4}>
        File Explorer
      </Text>
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
        mb={4}
      >
        <BreadcrumbItem onClick={() => fileExplorerRef.current?.changePath([])}>
          <FontAwesomeIcon icon={faHome} size="lg" color="blue.500" />
        </BreadcrumbItem>
        {path.map((p, index) => (
          <BreadcrumbItem
            key={`${p}-${index}`}
            onClick={() => handleBreadcrumbClick(index)}
          >
            <Text>{p}</Text>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>

      <FileExplorer
        dirs={dirStructure}
        render={(file, next) => (
          <Box
            cursor="pointer"
            p={3}
            borderWidth="2px"
            borderColor="gray.300"
            borderRadius="lg"
            mb={3}
            shadow="md"
            transition="transform 0.2s, boxShadow 0.2s"
            _hover={{
              transform: "scale(1.05)",
              shadow: "lg",
            }}
            display="flex"
            alignItems="center"
            onClick={next}
          >
            <FontAwesomeIcon
              icon={file.type === "dir" ? faFolder : faFile}
              size="lg"
              color={file.type === "dir" ? "orange.500" : "blue.500"}
            />
            <Text ml={3} fontWeight="medium">
              {file.name}
            </Text>
          </Box>
        )}
        ref={fileExplorerRef}
        onPathChange={setPath}
      />
    </Box>
  );
}

export default App;
