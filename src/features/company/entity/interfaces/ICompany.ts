import IConfiguration from "./IConfiguration";
import INumbers from "./INumbers";

interface ICompany {
    owner_id: string,
    name: string,
    description: string,
    category: string,
    numbers : INumbers
    configurations: IConfiguration,
    option: ""
}

export default ICompany;