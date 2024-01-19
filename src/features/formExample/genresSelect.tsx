import ChackraSelectWithClear from "../../componentsCommon/chackraSelectWithClear/chackraSelectWithClear";
import { useGetVideoGamesGenresQuery } from "./videoGamesApiSlice";

const VGGenreSelect = () => {
  const { data: options, isLoading } = useGetVideoGamesGenresQuery();

  

  return <ChackraSelectWithClear 
  handleInputChange={function (name: string, value: string): void {
      throw new Error("Function not implemented.");
  } } 
  options={[]} 
  title={""} 
  propName={""} />;
};
