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
    ]};

    for (let i = 0; i < 7; i++) {
        document.getElementById(`armor_original_skill_${i}`).innerHTML = `<option value=\"00_${i}\">-----</option>`;
        document.getElementById(`armor_new_skill_${i}`).innerHTML = `<option value=\"00_${i}\">-----</option>`;
    }

    document.getElementById("copy_result").innerText = "";

    let div_armor_id = document.getElementById("armor_id");
    let div_armor_name = document.getElementById("armor_name");
    let div_armor_rank = document.getElementById("armor_rank");
    let div_armor_slot = document.getElementById("armor_slot");
    let div_def_f = document.getElementById("def_f");
    let div_def_w = document.getElementById("def_w");
    let div_def_t = document.getElementById("def_t");
    let div_def_i = document.getElementById("def_i");
    let div_def_d = document.getElementById("def_d");
    let div_armor_skill = document.getElementById("armor_skill");
    let div_armor_pool = document.getElementById("armor_pool");
    let div_armor_cost = document.getElementById("armor_cost");

    id = event.target.value;
    var o = armor_list[id];

    k_result["eq_name"] = o["name"];

    div_armor_id.textContent = `ID: ${o["id"] + "_" + o["parts_id"]}`;
    div_armor_name.textContent = `Name: ${o["name"]}`;
    div_armor_rank.textContent = `Rank: ${o["rank"]}`;
    let slot = "";
    for (let i = 4; i > 0; i--) {
        let count = o[`slotLv${i}`];
        for (let j = 0; j < count; j++) {
            slot = slot + i;
        }
    }
    if (slot.length < 3) {
        for (let i = 0; i < 4 - slot.length; i++) {
            slot = slot + "-";
        }
    }
    div_armor_slot.textContent = `Slot: ${slot}`;
    div_def_f.textContent = `火: ${o["def_f"]}`;
    div_def_w.textContent = `水: ${o["def_w"]}`;
    div_def_t.textContent = `雷: ${o["def_t"]}`;
    div_def_i.textContent = `氷: ${o["def_i"]}`;
    div_def_d.textContent = `龍: ${o["def_d"]}`;

    div_armor_skill.innerHTML = "";
    for (i in o["skill"]) {
        let sname = o["skill"][i]["sname"];
        let lv = o["skill"][i]["lv"];
        let skill = `${sname}: Lv${lv}`;
        let skill_node = document.createElement("div");
        skill_node.textContent = skill;
        div_armor_skill.append(skill_node);
    }


    pool_id = armor_pool_cost[`${o["id"]}`]["pool"];
    armor_cost = armor_pool_cost[`${o["id"]}`]["cost"];
    div_armor_pool.textContent = `Pool Id: ${pool_id}`;
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
            } else {
                k_result["k_skill"][i]["k_skill_edit_hex"] = "00";
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
    document.getElementById("template_result").innerText = template_title + template;
}

function copyToClipboard() {
    let content = document.getElementById("template_result").innerText;
    navigator.clipboard.writeText(content);
    document.getElementById("copy_result").innerText = "copied!";
}