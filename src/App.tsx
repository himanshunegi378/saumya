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
  Button
} from "@chakra-ui/react";
import { faFile, faFolder } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { dummyData } from "./dummyData";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Card, CardHeader, CardBody, CardFooter,Stack,Heading,StackDivider } from '@chakra-ui/react'

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

interface MaterialCardProps {
  // material: Material;
  onSelectMaterial: (material: Material) => void;
}

 
const MaterialCard: React.FC<MaterialCardProps> = ({ onSelectMaterial}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaterials = dummyData.materials.filter((m) =>
  m.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div style={{ border: '2px solid #ccc', padding: '10px', margin: '10px',borderRadius: "10px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        width: "100%"
      }}>
      <h3 style={{
        fontFamily: "sans-serif",
        fontSize: "20px",
        marginLeft: "0px"
      }}>Materials</h3>
      <input
        type="text"
        placeholder="Search materials..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px', border: "3px solid silver", borderRadius: "3px" , width: "50%"}}
      />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredMaterials.map((material:any) => (
          <div
            key={material.id}
            style={{
              border: '3px solid #ddd',
              width: "30px",
              padding: '10px',
              margin: '10px',
              cursor: 'pointer',
              flex: '0 0 calc(50% - 20px)', // Set flex basis to make two items in one row
              transition: "border-color 0.3s", // Add a transition effect for a smooth hover
            }}
            onClick={() => onSelectMaterial(material)}
          >
            <h4>{material.name}</h4>
            {/* Display other material details here */}
          </div>
        ))}
      </div>
    </div>
  );
};

const StudyCard = ({selectedMaterial,onSelectStudies}:any) => {
  const [searchTerm, setSearchTerm] = useState('');
  console.log("studies",selectedMaterial.studies )

  const filteredStudies = dummyData.studies.filter((study) =>
    selectedMaterial.studies.includes(study.id) &&
    study.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div style={{ border: '2px solid #ccc', padding: '10px', margin: '10px',borderRadius: "10px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        width: "100%"
      }}>
      <h3 style={{
        fontFamily: "sans-serif",
        fontSize: "20px",
        marginLeft: "0px"
      }}>Studies</h3>
      <input
        type="text"
        placeholder="Search studies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px', border: "3px solid silver", borderRadius: "3px", width: "50%" }}
        
      />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredStudies.map((material:any) => (
          <div
            key={material.id}
            style={{
              border: '3px solid #ddd',
              width: "40px",
              padding: '10px',
              margin: '10px',
              cursor: 'pointer',
              flex: '0 0 calc(50% - 20px)', // Set flex basis to make two items in one row
            }}

            onClick={() => onSelectStudies(material)}

          >
            <h4>{material.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

const Protocols = ({selectedStudies,onSelectProtocols}:any) => {
  const [searchTerm, setSearchTerm] = useState('');
  console.log("studies",selectedStudies.protocols )

  const filteredStudies = dummyData.protocols.filter((study) =>
  selectedStudies.protocols.includes(study.id) &&
    study.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div style={{ border: '2px solid #ccc', padding: '10px', margin: '10px',borderRadius: "10px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        width: "100%"
      }}>
      <h3 style={{
        fontFamily: "sans-serif",
        fontSize: "20px",
        marginLeft: "0px"
      }}>Protocols</h3>
      <input
        type="text"
        placeholder="Search protocols..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px', border: "3px solid silver", borderRadius: "3px", width: "50%" }}
      />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredStudies.map((material:any) => (
          <div
            key={material.id}
            style={{
              border: '3px solid #ddd',
              width: "35px",
              padding: '10px',
              margin: '10px',
              cursor: 'pointer',
              flex: '0 0 calc(50% - 20px)', // Set flex basis to make two items in one row
            }}

            onClick={() => onSelectProtocols(material)}

          >
            <h4>{material.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};


const Test = ({selectedProtocols}:any) => {
  const [searchTerm, setSearchTerm] = useState('');
  console.log("studies",selectedProtocols.tests )

  const filteredStudies = dummyData.tests.filter((study) =>
  selectedProtocols.tests.includes(study.id) &&
    study.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div style={{ border: '2px solid #ccc', padding: '10px', margin: '10px',borderRadius: "10px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        width: "100%"
      }}>
      <h3 style={{
        fontFamily: "sans-serif",
        fontSize: "20px",
        marginLeft: "0px"
      }}>Tests</h3>
      <input
        type="text"
        placeholder="Search test..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px', border: "3px solid silver", borderRadius: "3px", width: "50%" }}
      />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredStudies.map((material:any) => (
          <div
            key={material.id}
            style={{
              border: '3px solid #ddd',
              width: "30px",
              padding: '10px',
              margin: '10px',
              cursor: 'pointer',
              flex: '0 0 calc(50% - 20px)', // Set flex basis to make two items in one row
            }}

            // onClick={() => onSelectProtocols(material)}

          >
            <h4>{material.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};


function App() {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedStudies, setSelectedStudies] = useState(null);
  const [selectedProtocols, setSelectedProtocols] = useState(null);
  const onSelectMaterial = (material:any) => {
    setSelectedMaterial(material);
    setSelectedStudies(null);
    setSelectedProtocols(null);
  };
  const onSelectStudies = (material:any) => {
    setSelectedStudies(material);
    setSelectedProtocols(null);

  };

  const onSelectProtocols = (material:any) => {
    setSelectedProtocols(material);
  };
  console.log(selectedMaterial)
  return (
    <Box p={4}>
      <div style={{
        display: 'flex',
        justifyContent: "space-between"
      }}>
      <Text fontSize="lg" mb={4}>
        File Explorer
      </Text>
      <Button>Summary & Progress report</Button>
      </div>
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
        mb={4}
      >
      </Breadcrumb>

      <div style={{ display: 'flex' }}>
        
          <MaterialCard onSelectMaterial={onSelectMaterial} />
          <div>
        {selectedMaterial && (
          <StudyCard
          selectedMaterial = {selectedMaterial}
          onSelectStudies = {onSelectStudies}
          />
        )}
      </div>

      <div>
        {selectedStudies && (
          <Protocols
          selectedStudies = {selectedStudies}
          onSelectProtocols = {onSelectProtocols}
          />
        )}
      </div>
      <div>
        {selectedProtocols && (
          <Test
          selectedProtocols = {selectedProtocols}
          />
        )}
      </div>
      </div>

      
    </Box>
  );
}

export default App;
