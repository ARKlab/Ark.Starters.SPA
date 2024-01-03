import { Box } from "@chakra-ui/react";
import ConfigTable, { Employee } from "./configTable";

const ConfigTableExampleView = () => {
  const data = [
    { name: "Mario", surName: "Rossi", employed: true },
    { name: "Luigi", surName: "Bianchi", employed: false },
    { name: "Giuseppe", surName: "Verdi", employed: true },
    { name: "Francesco", surName: "Neri", employed: false },
    { name: "Antonio", surName: "Bruno", employed: true },
    { name: "Giovanni", surName: "Russo", employed: false },
    { name: "Andrea", surName: "Romano", employed: true },
    { name: "Michele", surName: "Ricci", employed: false },
    { name: "Alessandro", surName: "Marino", employed: true },
    { name: "Roberto", surName: "Greco", employed: false },
    { name: "Riccardo", surName: "Gallo", employed: true },
    { name: "Marco", surName: "Costa", employed: false },
    { name: "Nicola", surName: "Giordano", employed: true },
    { name: "Davide", surName: "Mancini", employed: false },
    { name: "Alberto", surName: "Rizzo", employed: true },
    { name: "Daniele", surName: "Lombardi", employed: false },
    { name: "Salvatore", surName: "Moretti", employed: true },
    { name: "Vincenzo", surName: "Fontana", employed: false },
    { name: "Federico", surName: "Russo", employed: true },
    { name: "Gianluca", surName: "Ferrari", employed: false },
  ] as Employee[];

  return (
    <Box my="70px">
      <ConfigTable title={"Dipendenti"} data={data} />
    </Box>
  );
};

export default ConfigTableExampleView;
