
export const pageSizeOptions = [10, 25, 50];
export const avatarOpacity = 33;
export const minimumFenceRadius = 10;
export const maximumFenceRadius = 1000;
export const oneDayInMs = 86400000;
export const jobOpacity = '1A';
export const emailRegex = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@' + '[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
export const paginatorOptions = {
    page_no: 1,
    page_size: pageSizeOptions[1],
    total_records: 0
}
export const timezoneMapping = [
    {key: 'HST', value: 'Pacific/Honolulu', name: 'Hawaii/USA Standad Time (HST)'},
    {key: 'AKST', value: 'America/Anchorage',name:'Alaska Standard Time (AKST)'},
    {key: 'PST', value: 'America/Los_Angeles',name:'Pacific Standard Time (PST)'},
    {key: 'MST', value: 'America/Phoenix',name: 'Mountain Standard Time (MST)'},
    {key: 'CST', value: 'America/Chicago', name:'Central Standard Time (CST)'},
    {key: 'EST', value: 'America/New_York', name:'Eastern Standard Time (EST)'},
    {key: 'PKT', value: 'Asia/Karachi', name: 'Pakistan Standard Time (PKT)'},
  ]
export const userTagColors = [
    '#abf1ff', '#fff598', '#b9ebb7', '#ffb8e9', '#e8f283', '#EACEFC', '#ffcebc', '#c7e0ff', '#98F3E1', '#FFCE8E'
    ]
// export const taskTagColors = [
//     '#7EC9A3', '#B3DB99', '#ACB5D8', '#DFB368', '#89A2B5', '#F303B3', '#FF3378', '#B813A6', '#E87603', '#11853B', 
//     ,'#39B4B4']


export const taskTagColors = [
    '#39B4B4', '#31C5CE', '#56CA92', '#8845DA', '#44B4CE', '#A386D0', '#54A5A9', '#FFCB21', 
    '#EC864D', '#229B70', '#92D074', '#F27357', '#A0C60B', '#E664E9', '#FBA651', '#7681E1']

  export const countries = [{
        code: "+1",
        img: "assets/united-states.svg"
    }, 
    {
        code: "+34",
        img: "assets/spain.svg"
    }, 
    {
        code: "+44",
        img: "assets/united-kingdom.svg"
    }, 
    {
        code: "+61",
        img: "assets/australia.svg"
    }, 
    {
        code: "+81",
        img: "assets/japan.svg"
    }, 
    // {
    //     code: "+86",
    //     img: "assets/china.svg"
    // }, 
    {
        code: "+92",
        img: "assets/pak.svg"
    }, 
    {
        code: "+971",
        img: "assets/united-arab-emirates.svg"
    }, 
    {
        code: "+974",
        img: "assets/qatar.svg"
    }, 

];