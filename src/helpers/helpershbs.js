module.exports = {
    sum: (a,b)=> a+ Number(b),
    tich: (a,b,c) => a + b*Number(c),
    sortable: (field, sort) => {

        console.log('sort : ' + sort);
        const sortType = "default" ;

        const icons = {
            default: "oi oi-elevator",
            asc: "oi oi-sort-ascending",
            desc: "oi oi-sort-descending",
        };

        const types = {
            default: "desc",
            asc: "desc",
            desc: "asc",
        };

        const icon = icons[sortType];
        const type = types[sortType];

        return `<a href="?_sort&column=${field}&type=${type}">
        <span class="${icon}"></span>
        </a>`;
    },

    check: (value) => {
        console.log(value);
        if (value == true) {
            return "Đã thanh toán";
        }
        return "Chưa thanh toán"
    },
};