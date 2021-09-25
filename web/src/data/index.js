
export const fetchProjects = () => {

    fetch("http://192.168.31.179:3000/api/base").then(
        res => {
            return res.json();
        }
    ).then(
        data => {
            console.log(data);
            console.log(1);
            return data;
        }
    ).catch((e) => {
        console.log(e);
    });

};
//
// const getaxiosGet = () => {
//     axios({
//         method:'get',
//         url:'/api/excel/web/status/disable/2',
//         headers: {
//             'Content-Type': 'application/json;charset=utf-8'
//         }
//     }).then(function(res){
//         console.log(res.data);
//     }).catch(function(error){
//         console.log(error);
//     });
// }