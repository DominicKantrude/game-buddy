const remoteURL = "http://localhost:5002"

export default Object.create(null, {
    get: {
        value: function (id) {
            return fetch(`${remoteURL}/${this.type}/${id}`).then(e => e.json())
        }
    },
    getAll: {
        value: function () {
            return fetch(`${remoteURL}/${this.type}`)
                .then(e => e.json())
        }
    },
    delete: {
        value: function (id) {
            return fetch(`${remoteURL}/${this.type}/${id}`, {
                method: "DELETE"
            })
                .then(e => e.json())



        }
    },

    addObject: {
        value: function (object) {
            return fetch(`${remoteURL}/${this.type}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(object)
            }).then(data => data.json())

        }

    },

    getUserFriends : {
        value: function(){
            return fetch(`${remoteURL}/${this.type}?relatingUserId=${parseInt(sessionStorage.getItem("credentials"))}&_expand=user`)
            .then(r => r.json())
        }
    },

    addSessionUserRelation : {
        value: function(object){
            return fetch("http://localhost:5002/sessionUserRelation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(object)
            })
        }
    }
})
