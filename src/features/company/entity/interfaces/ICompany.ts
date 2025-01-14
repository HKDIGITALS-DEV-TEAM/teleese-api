import IConfiguration from "./IConfiguration";

interface ICompany {
    owner_id: string,
    name: string,
    description: string,
    category: string,
    users: [],
    configurations: IConfiguration,
    option: ""
}

export default ICompany;