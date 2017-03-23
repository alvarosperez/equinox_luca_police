function fillMenu(list) {
    let defList = ['coche1', 'coche2', 'coche3']
    for (let a of defList) {
        console.log(a)
        $("#menu #cars").append("<a href='#'>" + a + "</a>")
    }
}