const formatTitle = ( string ) => {
    string = string.replace(/&amp;/g, '&');
    return string;
};

export default formatTitle;