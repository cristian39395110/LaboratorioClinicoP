console.log({ok});
const noRadio = document.getElementById("no");
            const siRadio = document.getElementById("si");
            const searchInput = document.getElementById("searchInput");
            searchInput.addEventListener("input", () => {
              const searchTerm = searchInput.value;
              formu.action = "/pacientes/" + searchTerm;
            });
            
           
            const disabled = document.getElementById("disabled-tab");
            if(ok && pacient.length===0){
              disabled.removeAttribute("disabled");}
            
            if(siRadio){
             siRadio.addEventListener("click", () => {
               if (siRadio.checked) {
                 disabled.setAttribute("disabled", "disabled");
               }
             });
             noRadio.addEventListener("click", () => {
                 if (noRadio.checked) {
                   disabled.removeAttribute("disabled");
                 }
               });
               
             
             } 