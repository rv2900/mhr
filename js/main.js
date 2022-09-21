var k_result = {
    eq_name: "",
    eq_pos: 0, 
    eq_pos_hex: "00", 
    k_skill: [
        { k_skill_hex: "00", k_skill_edit_hex: "00" },
        { k_skill_hex: "00", k_skill_edit_hex: "00" },
        { k_skill_hex: "00", k_skill_edit_hex: "00" },
        { k_skill_hex: "00", k_skill_edit_hex: "00" },
        { k_skill_hex: "00", k_skill_edit_hex: "00" },
        { k_skill_hex: "00", k_skill_edit_hex: "00" },
        { k_skill_hex: "00", k_skill_edit_hex: "00" },
    ]};

var k_slot = {
    slotLv1: 0,
    slotLv2: 0,
    slotLv3: 0,
    slotLv4: 0,
}

var k_slot_simple = [0, 0, 0];
var k_slot_simple_oringal = [0, 0, 0];
var k_slot_limit = 5; // slot add level limit to 5, cost 30

var k_skill = {
    sname: "", lv: 0,
    sname: "", lv: 0,
    sname: "", lv: 0,
    sname: "", lv: 0,
    sname: "", lv: 0,
}

var k_def = {
    def_f:0,
    def_w:0,
    def_t:0,
    def_i:0,
    def_d:0,
}

armor_sel = document.getElementById("armor_select");
for (i in armor_list) {
    var o = armor_list[i];
    if (o["rank"] > 7 & o["bougyo"] > 0) {
        let opt = document.createElement("option");
        opt.value = o["id"].toString() + "_" + o["parts_id"].toString();
        opt.text = o["name"];
        armor_sel.appendChild(opt);
    }
}
armor_sel.addEventListener("change", (event) => {
    // reset all

    k_result = {
    eq_name: "",
    eq_pos: 0, 
    eq_pos_hex: "00", 
    k_skill: [
        { k_skill_hex: "00", k_skill_edit_hex: "00" },
        { k_skill_hex: "00", k_skill_edit_hex: "00" },
        { k_skill_hex: "00", k_skill_edit_hex: "00" },
        { k_skill_hex: "00", k_skill_edit_hex: "00" },
        { k_skill_hex: "00", k_skill_edit_hex: "00" },
        { k_skill_hex: "00", k_skill_edit_hex: "00" },
        { k_skill_hex: "00", k_skill_edit_hex: "00" },
        ]
    };
    
    k_slot = {
        slotLv1: 0,
        slotLv2: 0,
        slotLv3: 0,
        slotLv4: 0,
    }

    k_slot_simple = [0, 0, 0];
    k_slot_simple_oringal = [0, 0, 0];

    k_skill = {
        sname: "", lv: 0,
        sname: "", lv: 0,
        sname: "", lv: 0,
        sname: "", lv: 0,
        sname: "", lv: 0,
    }
    
    k_def = {
        def: 0,
        def_max: 0,
        def_f: 0,
        def_w: 0,
        def_t: 0,
        def_i: 0,
        def_d: 0,
    }

    for (let i = 0; i < 7; i++) {
        document.getElementById(`armor_original_skill_${i}`).innerHTML = `<option value=\"00_${i}\">-----</option>`;
        document.getElementById(`armor_new_skill_${i}`).innerHTML = `<option value=\"00_${i}\">-----</option>`;
    }

    document.getElementById("copy_result").innerText = "";

    let div_armor_slot = document.getElementById("armor_slot");
    let div_def_f = document.getElementById("def_f");
    let div_def_w = document.getElementById("def_w");
    let div_def_t = document.getElementById("def_t");
    let div_def_i = document.getElementById("def_i");
    let div_def_d = document.getElementById("def_d");
    let div_armor_skill = document.getElementById("armor_skill");
    let div_armor_cost = document.getElementById("armor_cost");

    id = event.target.value;
    var o = armor_list[id];

    k_result["eq_name"] = o["name"];

    let slot = "";
    for (let i = 4; i > 0; i--) {
        k_slot[`slotLv${i}`] = o[`slotLv${i}`];
        let count = o[`slotLv${i}`];
        for (let j = 0; j < count; j++) {
            slot = slot + i;
        }
    }

    for (let i = 0; i < slot.length; i++) {
        k_slot_simple[i] = parseInt(slot.split("")[i]);
        k_slot_simple_oringal[i] = parseInt(slot.split("")[i]);
    }

    if (slot.length < 3) {
        for (let i = 0; i < 4 - slot.length; i++) {
            slot = slot + "-";
        }
    }

    div_armor_slot.textContent = `スロット：${slot}`;
    div_def_f.textContent = `火: ${o["def_f"]}`;
    div_def_w.textContent = `水: ${o["def_w"]}`;
    div_def_t.textContent = `雷: ${o["def_t"]}`;
    div_def_i.textContent = `氷: ${o["def_i"]}`;
    div_def_d.textContent = `龍: ${o["def_d"]}`;

    div_armor_skill.innerHTML = "";
    for (i in o["skill"]) {
        let sname = o["skill"][i]["sname"];
        let lv = o["skill"][i]["lv"];
        let skill = `${sname}：Lv${lv}`;
        let skill_node = document.createElement("li");
        skill_node.className = "list-group-item";
        skill_node.textContent = skill;
        div_armor_skill.append(skill_node);
    }


    pool_id = armor_pool_cost[`${o["id"]}`]["pool"];
    armor_cost = armor_pool_cost[`${o["id"]}`]["cost"];
    div_armor_cost.textContent = `Armor Cost: ${armor_cost}`;

    k_skills = k_skill_add[pool_id.toString()];
    let k_skills_cost_list = [0, 0, 0, 0, 0, 0, 0];
    let k_skills_hex_list = ["00", "00", "00", "00", "00", "00", "00"];
    for (let i = 0; i < 7; i++) {
        let k_skill_sel = document.getElementById(`k_skill_${i}`);
        k_skill_sel.innerHTML = `<option value="00_0_${i}">-----</option>`;
        for (j in k_skills) {
            let opt = document.createElement("option");
            opt.value = k_skills[j]["hex"] + "_" + k_skills[j]["cost"] + `_${i}`;
            opt.text = k_skills[j]["name"] + " cost: " + k_skills[j]["cost"];
            k_skill_sel.appendChild(opt);
        }
        k_skill_sel.addEventListener("change", (event) => {
            document.getElementById(`armor_original_skill_${i}`).innerHTML = `<option value=\"00_${i}\">-----</option>`;
            document.getElementById(`armor_new_skill_${i}`).innerHTML = `<option value=\"00_${i}\">-----</option>`;

            let t_values = event.target.value.split('_');
            let k_skill_hex = t_values[0];
            let k_skill_cost = parseInt(t_values[1]);
            let k_skill_no = parseInt(t_values[2]); // from 0 to 6

            k_result["k_skill"][i]["k_skill_hex"] = k_skill_hex;

            k_skills_cost_list[k_skill_no] = k_skill_cost;
            k_skills_hex_list[k_skill_no] = k_skill_hex;
            let sum = k_skills_cost_list.reduce((partialSum, a) => partialSum + a, 0);
            div_armor_cost.textContent = `Armor Cost: ${armor_cost - sum}`;
            
            // todo: add function to walk through k_skill_0 ~ 6 to see whether add slot skill existed.
            // delete skill hex 0x95
            if (k_skill_hex == "95") {
                sel_armor_original_skill = document.getElementById(`armor_original_skill_${i}`);
                sel_armor_original_skill.innerHTML = `<option value=\"00_${i}\">-----</option>`;

                for (let j in o["skill"]) {
                    opt = document.createElement("option");
                    sname = o["skill"][j]["sname"];
                    slv = o["skill"][j]["lv"];
                    opt.text = sname + " Lv: " + slv;
                    shex = skill_hex_cost[sname]["hex"];
                    opt.value = `${shex}_${i}`;
                    sel_armor_original_skill.appendChild(opt);
                }
                sel_armor_original_skill.addEventListener("change", (event) => {
                    let t_values = event.target.value.split("_");
                    k_result["k_skill"][t_values[1]]["k_skill_edit_hex"] = t_values[0]; 
                });
            // add skill hex 0x90 to 0x94
            } else if (["90", "91", "92", "93", "94"].includes(k_skill_hex)) {
                sel_armor_new_skill = document.getElementById(`armor_new_skill_${i}`);
                sel_armor_new_skill.innerHTML = `<option value=\"00_${i}\">-----</option>`;
                cost_skill_list = cost_skill_hex[t_values[1]];
                for (j in cost_skill_list) {
                    let opt = document.createElement("option")
                    let sname = cost_skill_list[j]["sname"];
                    let shex = cost_skill_list[j]["hex"];
                    opt.value = `${shex}_${i}`;
                    opt.text = sname;
                    sel_armor_new_skill.appendChild(opt);
                }
                sel_armor_new_skill.addEventListener("change", (event) => {
                    let t_values = event.target.value.split("_");
                    k_result["k_skill"][t_values[1]]["k_skill_edit_hex"] = t_values[0];
                });
            } else if (["8B", "8C", "8D"].includes(k_skill_hex)) {
                k_slot_simple_add(k_skill_hex, i);
            }            
            else {
                k_result["k_skill"][i]["k_skill_edit_hex"] = "00";
                k_slot_simple = JSON.parse(JSON.stringify(k_slot_simple_oringal));
                console.log(k_slot_simple);
            }
        });
    }
});

function genTemplate() {
    let eq_pos = document.getElementById("armor_pos").value.split("_");
    let template_title = `[ 錬成No.${eq_pos[1]}位置： ${k_result["eq_name"]} ]`;
    // k_skill_step start at 0x20, step 8, max 0x50, total 7 items
    let template = "";
    
    for (i = 32; i < 88; i += 8) {
        k_skill_step = i.toString(16);
        index = i / 8 - 4;
        k_skill_hex = k_result["k_skill"][index]["k_skill_hex"];
        k_skill_edit_hex = k_result["k_skill"][index]["k_skill_edit_hex"];
        let template_block =`
580F0000 11A55660
580F1000 00000088
580F1000 00000028
580F1000 00000010
580F1000 000000${eq_pos[0]}
580F1000 000000A0
580F1000 000000${k_skill_step}
780F0000 00000010
680F0000 00000000 000000${k_skill_hex}
780F0000 00000008
680F0000 00000000 000000${k_skill_edit_hex}`;
        template += template_block;
    }
    document.getElementById("template_result").innerText = template_title + template + "\n";
}

function copyToClipboard() {
    let content = document.getElementById("template_result").innerText;
    navigator.clipboard.writeText(content);
    document.getElementById("copy_result").innerText = "copied!";
}

function k_slot_add(v) {
    let count = 0;
    for (let i in k_slot) {
        count += k_slot[i];
    }

    if (count < 3 && k_slot["slotLv1"] < 3) {
        
    }
    while (v > 0) {
        for (i in k_slot) {
            
        }
        if (k_slot["slotLv1"] < 3) {
            k_slot["slotLv1"] += 1;
        }
        v--;
    }
}

function k_slot_simple_add(k_skill_hex, idx) {
    let k_slot_simple = JSON.parse(JSON.stringify(k_slot_simple_oringal));
    console.log(k_slot_simple_oringal);
    let v = 0;
    switch (k_skill_hex) {
        case "8B":
            v = 1;
            break;
        case "8C":
            v = 2;
            break;
        case "8D":
            v = 3;
            break;
        default:
            v = 0;
    }
    console.log(v);

    // check other k_skill item whether slot add skill
    for (let i = 0; i < 7; i++){
        if (i != idx) {
            let slot_add_value = document.getElementById(`k_skill_${i}`).value.split("_")[0];
            switch (slot_add_value) {
                case "8B":
                    v += 1;
                    break;
                case "8C":
                    v += 2;
                    break;
                case "8D":
                    v += 3;
                    break;
                default:
                    v += 0;
            }
        }
    }

    console.log(v);

    if (v > 0) {
        for (let i = 0; i < 3; i++) {
            if (v > 0 && k_slot_simple[i] == 0) {
                k_slot_simple[i] = 1;
                v--;
            }
        }
        for (let i = 0; i < 3; i++) {
            if (v > 0 && k_slot_simple[i] < 4) {
                let tmp = k_slot_simple[i];
                if ((tmp + v) > 4) {
                    k_slot_simple[i] = 4;
                    v = tmp + v - 4;
                } else {
                    k_slot_simple[i] = tmp + v;
                    v = 0;
                }
            }
        }
    }
    console.log(k_slot_simple);
}