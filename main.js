function arraysEqual(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1)==JSON.stringify(a2);
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }


var app = new Vue({
    el: '#app',
    data: {
      verbs: [],
      state: "menu",
      nombre: 0,
      connus: 0,
      infinitif: "",
      preterit: "",
      part_pass: "",
      trad: "",
      current_verb: 0,
      given_column: 0,
      streak_to_known: 3,
      message: "",
      streak:{},
    },
    mounted: async function() {
        verbs = await axios.get("./data.json") //RECUPERE LA LISTE DES TP
        this.verbs = verbs["data"]['verbs']
        this.randomVerb();
        document.getElementById("to_show").style.display = "block"

    },
    methods: {
        startGame: async function(){ //POPUP QUI DEMANDE LE NOMBRE DE TP A ETUDIER
            const { value: nombre } = await Swal.fire({
            title: 'Nombre de TP a étudier',
            input: 'number',
            inputLabel: '',

            showCancelButton: true,
            inputValidator: (value) => {
                if (!value || isNaN(parseInt(value)) && value) {
                    return 'Vous devez rentrer un nombre'
                }

                if (value > this.verbs.length) {
                    return "Nombre top élevé ( Max : "+this.verbs.length.toString() +" )"
                }
            }
            })

            if (nombre) {
                this.nombre = nombre
                this.verbs = this.verbs.splice(0,nombre)
                this.state = "game";
                this.randomVerb()
            }
        },
        randomVerb: async function(){
            verb = await chance.pickone(this.verbs);
            verb_index = this.verbs.indexOf(verb);

            to_player = ["","","",""]

            this.given_column = chance.integer({ min: 0, max: 3 })

            this.reset_fields()

            this.message = ""

            
            this.current_verb = verb_index;
        },
        reset_fields: async function() {
            to_player = ["","","",""]
            to_player[this.given_column] = verb[this.given_column]

            this.infinitif = to_player[0]
            this.preterit = to_player[1]
            this.part_pass = to_player[2]
            this.trad = to_player[3]

        },
        submit: async function() {
            if (arraysEqual(this.verbs[this.current_verb],[this.infinitif,this.preterit,this.part_pass,this.trad])){


                if (this.current_verb in Object.keys(this.streak)) {
                    this.streak[this.current_verb] += 1
                } else {
                    this.streak[this.current_verb] = 1
                }

                if (this.streak[this.current_verb] == this.streak_to_known) {
                    this.verbs.splice(this.current_verb,1)
                    this.connus += 1
                }

                if (this.connus == this.nombre) {
                    this.win()
                }

                this.randomVerb();
            } else {

                console.log([this.infinitif,this.preterit,this.part_pass,this.trad])
                console.log(this.verbs[this.current_verb])
                this.message = "Incorrect !<br> C'était "+this.verbs[this.current_verb].join(" - ")
                this.reset_fields()
               
    
                

            }
        },
        win: async function() {
            await Swal.fire({
                icon: 'success',
                title: 'Bravo',
                text: 'Vous avez fini cet exercice',
            })
            document.location.reload()
        }
    }

  })

