// armor skill item limit to 5,
const ARMOR_SKILL_LIMIT = 5;

const DEF_MAP = Object.keys(k_skill_def_map);

var k_result = {};

var k_origin = {
    eq_id: "",
    eq_name: "",
    eq_pos: 0,
    eq_pos_hex: "00",
    eq_slot: "000",
    eq_k_slot: "000",
    eq_cost: 0,
    eq_pool_id: 0,
    def: 0,
    def_f: 0,
    def_w: 0,
    def_t: 0,
    def_i: 0,
    def_d: 0,
    eq_origin_skill: {
    // "skill name": origin level,
    },
    eq_skill: {
    // "skill name": level,
    },
    eq_skill_available: ARMOR_SKILL_LIMIT,
    k_skill: [
        { k_skill_hex: "00", k_skill_edit_hex: "00", k_skill_name: "", k_skill_name_value: 0, k_skill_cost: 0 },
        { k_skill_hex: "00", k_skill_edit_hex: "00", k_skill_name: "", k_skill_name_value: 0, k_skill_cost: 0 },
        { k_skill_hex: "00", k_skill_edit_hex: "00", k_skill_name: "", k_skill_name_value: 0, k_skill_cost: 0 },
        { k_skill_hex: "00", k_skill_edit_hex: "00", k_skill_name: "", k_skill_name_value: 0, k_skill_cost: 0 },
        { k_skill_hex: "00", k_skill_edit_hex: "00", k_skill_name: "", k_skill_name_value: 0, k_skill_cost: 0 },
        { k_skill_hex: "00", k_skill_edit_hex: "00", k_skill_name: "", k_skill_name_value: 0, k_skill_cost: 0 },
        { k_skill_hex: "00", k_skill_edit_hex: "00", k_skill_name: "", k_skill_name_value: 0, k_skill_cost: 0 },
    ]};



// fill armor position <select>
armor_pos = document.getElementById("armor_pos");
for (let i = 0; i < 10; i++) {
    let eq_pos_hex = 32;
    eq_pos_hex = eq_pos_hex + i * 8;
    let opt = document.createElement("option");
    eq_pos = i + 1;
    opt.value = `${eq_pos_hex.toString(16)}_${eq_pos}`;
    opt.text = `${eq_pos}`;
    armor_pos.appendChild(opt);
}
armor_pos.addEventListener("change", (event) => { 
    let eq_position = event.target.value.split("_");
    k_origin["eq_pos"] = eq_position[1];
    k_origin["eq_pos_hex"] = eq_position[0];
    k_result["eq_pos"] = eq_position[1];
    k_result["eq_pos_hex"] = eq_position[0];
});

// fill armor list <select>
armor_sel = document.getElementById("armor_select");
for (let i in armor_list) {
    var o = armor_list[i];
    if (o["rank"] > 7 & o["bougyo"] > 0) {
        let opt = document.createElement("option");
        opt.value = o["id"].toString() + "_" + o["parts_id"].toString();
        opt.text = o["name"];
        armor_sel.appendChild(opt);
    }
}
armor_sel.addEventListener("change", (event) => {
    let armor_id = event.target.value;
    var armor_data = armor_list[armor_id];

    // initial k_origin, k_result, render div
    init(armor_id, armor_data);
    
    pool_id = armor_pool_cost[`${armor_data["id"]}`]["pool"];
    k_origin["eq_pool_id"] = pool_id;
    k_result["eq_pool_id"] = pool_id;
    k_skills = k_skill_add[pool_id.toString()];

    for (let i = 0; i < 7; i++) {
        let k_skill_sel = document.getElementById(`k_skill_${i}`);
        k_skill_sel.innerHTML = `<option value="00_0">-----</option>`;
        for (let j in k_skills) {
            let opt = document.createElement("option");
            opt.value = k_skills[j]["hex"] + "_" + k_skills[j]["cost"];
            opt.text = k_skills[j]["name"] + " cost: " + k_skills[j]["cost"];
            k_skill_sel.appendChild(opt);
        }
        k_skill_sel.addEventListener("change", (event) => {
            document.getElementById(`armor_original_skill_${i}`).innerHTML = `<option value=\"00_0\">-----</option>`;
            document.getElementById(`armor_new_skill_${i}`).innerHTML = `<option value=\"00_0\">-----</option>`;

            let t_values = event.target.value.split('_');
            let k_skill_hex = t_values[0];
            let k_skill_cost = parseInt(t_values[1]);

            k_result["k_skill"][i]["k_skill_hex"] = k_skill_hex;
            k_result["k_skill"][i]["k_skill_edit_hex"] = "00";
            k_result["k_skill"][i]["k_skill_cost"] = k_skill_cost;

            render_armor_cost();
            render_armor_def();

            let k_slot_simple = k_slot_simple_add(k_skill_hex, i);
            k_result["eq_k_slot"] = k_slot_simple.join("");
            render_armor_slot(`${k_result["eq_slot"]} >>> ${k_result["eq_k_slot"]}`);
            // todo: add function to walk through k_skill_0 ~ 6 to see whether add slot skill existed.
            // skill delete hex: 0x95
            if (k_skill_hex == "95") {
                sel_armor_original_skill = document.getElementById(`armor_original_skill_${i}`);
                sel_armor_original_skill.innerHTML = `<option value=\"00\">-----</option>`;

                for (let j in armor_data["skill"]) {
                    let opt = document.createElement("option");
                    let sname = armor_data["skill"][j]["sname"];
                    let slv = armor_data["skill"][j]["lv"];
                    opt.text = sname + "+" + slv;
                    let skill_hex = skill_hex_cost[sname]["hex"];
                    opt.value = `${skill_hex}`;
                    sel_armor_original_skill.appendChild(opt);
                }
                sel_armor_original_skill.addEventListener("change", (event) => {
                    let skill_edit_hex = event.target.value
                    let skill_name = sel_armor_original_skill.options[sel_armor_original_skill.selectedIndex].text.split("+")[0];
                    k_result["k_skill"][i]["k_skill_edit_hex"] = skill_edit_hex;
                    k_result["k_skill"][i]["k_skill_name"] = skill_name;
                    k_result["k_skill"][i]["k_skill_name_value"] = -1;
                    k_result["eq_skill"][skill_name] += -1;
                    
                    render_armor_skill();
                });
            // skill add hex: 0x90 to 0x94
            } else if (["90", "91", "92", "93", "94"].includes(k_skill_hex)) {
                sel_armor_new_skill = document.getElementById(`armor_new_skill_${i}`);
                sel_armor_new_skill.innerHTML = `<option value=\"00\">-----</option>`;
                cost_skill_list = cost_skill_hex[t_values[1]];
                for (let j in cost_skill_list) {
                    let opt = document.createElement("option")
                    let sname = cost_skill_list[j]["sname"];
                    let skill_hex = cost_skill_list[j]["hex"];
                    opt.value = `${skill_hex}`;
                    opt.text = sname;
                    sel_armor_new_skill.appendChild(opt);
                }
                sel_armor_new_skill.addEventListener("change", (event) => {
                    let skill_edit_hex = event.target.value
                    let skill_name = sel_armor_new_skill.options[sel_armor_new_skill.selectedIndex].text;
                    if (Object.keys(k_result["eq_skill"]).length < ARMOR_SKILL_LIMIT) {
                        if (Object.keys(k_result["eq_skill"]).includes(skill_name)) {
                            k_result["eq_skill"][skill_name] += 1;
                        } else {
                            k_result["eq_skill"][skill_name] = 1;
                        }
                        k_result["k_skill"][i]["k_skill_edit_hex"] = skill_edit_hex;
                        k_result["k_skill"][i]["k_skill_name"] = skill_name;
                        k_result["k_skill"][i]["k_skill_name_value"] = 1;

                        render_armor_skill();
                    } else {
                        alert("スキルは5個までです！");
                        sel_armor_new_skill.options[0].selected = true;
                    }
                });
            } else {
                k_result["k_skill"][i]["k_skill_edit_hex"] = "00";
                k_result["k_skill"][i]["k_skill_name"] = "";
                k_result["k_skill"][i]["k_skill_name_value"] = 0;
            }
        });
    }
});

function genTemplate() {
    let template_title = `[ 錬成No.${k_result["eq_pos"]}位置： ${k_result["eq_name"]} ]`;
    // k_skill_step start at 0x20, step 8, max 0x50, total 7 items
    let template = "";
    
    for (i = 32; i < 88; i += 8) {
        k_skill_step = i.toString(16);
        index = i / 8 - 4;
        k_skill_hex = k_result["k_skill"][index]["k_skill_hex"];
        k_skill_edit_hex = k_result["k_skill"][index]["k_skill_edit_hex"];
        version_code = "129E11F8";   // version update code
        let template_block =`
580F0000 ${version_code}
580F1000 00000088
580F1000 00000028
580F1000 00000010
580F1000 000000${k_result["eq_pos_hex"]}
580F1000 000000A0
580F1000 000000${k_skill_step}
780F0000 00000010
680F0000 00000000 000000${k_skill_hex}
780F0000 00000008
680F0000 00000000 000000${k_skill_edit_hex}`;
        template += template_block;
    }
    document.getElementById("template_result").innerText = "";
    document.getElementById("template_result").innerText = template_title + template + "\n";
}

function copyToClipboard() {
    let content = document.getElementById("template_result").innerText;
    navigator.clipboard.writeText(content);
    document.getElementById("copy_result").innerText = "copied!";
}

function slot_simplify(armor_data) {
    let slot = "";
    for (let i = 4; i > 0; i--) {
        let count = armor_data[`slotLv${i}`];
        for (let j = 0; j < count; j++) {
            slot = slot + i;
        }
    }
    if (slot.length < 3) {
        for (let i = 0; i < 4 - slot.length; i++) {
            slot = slot + "0";
        }
    }
    return slot;
}

function init(armor_id, armor_data) {
    k_origin["eq_id"] = armor_id;
    k_origin["eq_name"] = armor_data["name"];
    k_origin["eq_skill"] = {};
    k_origin["eq_origin_skill"] = {};
    for (let i = 0; i < armor_data["skill"].length; i++) {
        k_origin["eq_skill"][armor_data["skill"][i]["sname"]] = 0;
        k_origin["eq_origin_skill"][armor_data["skill"][i]["sname"]] = armor_data["skill"][i]["lv"];
    }
    k_origin["eq_skill_available"] = ARMOR_SKILL_LIMIT - Object.keys(k_origin["eq_skill"]).length;

    let eq_position = document.getElementById("armor_pos").value.split("_");
    k_origin["eq_pos"] = eq_position[1];
    k_origin["eq_pos_hex"] = eq_position[0];

    let slot = slot_simplify(armor_data);
    k_origin["eq_slot"] = slot;
    k_origin["eq_k_slot"] = slot;

    let armor_cost = armor_pool_cost[armor_data["id"]]["cost"];
    k_origin["eq_cost"] = armor_cost;
    k_origin["def"] = armor_data["bougyo_max"];
    k_origin["def_f"] = armor_data["def_f"];
    k_origin["def_w"] = armor_data["def_w"];
    k_origin["def_t"] = armor_data["def_t"];
    k_origin["def_i"] = armor_data["def_i"];
    k_origin["def_d"] = armor_data["def_d"];

    k_result = JSON.parse(JSON.stringify(k_origin));

    render_armor_slot(slot);
    render_armor_def();
    render_armor_skill();
    render_armor_cost();

    for (let i = 0; i < 7; i++) {
        document.getElementById(`armor_original_skill_${i}`).innerHTML = `<option value=\"00_${i}\">-----</option>`;
        document.getElementById(`armor_new_skill_${i}`).innerHTML = `<option value=\"00_${i}\">-----</option>`;
    }

    document.getElementById("copy_result").innerText = "";
}

function k_slot_simple_add(k_skill_hex, idx) {
    let v = 0;
    // slot add hex: 0x8B to 0x8D
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
    // check other k_skill item whether slot add skill
    for (let i = 0; i < 7; i++){
        if (i != idx) {
            let slot_add_value = k_result["k_skill"][i]["k_skill_hex"];
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
    let k_slot_simple = k_result["eq_slot"].split("").map(str => Number(str));
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
    return k_slot_simple;
}

function render_armor_skill() {
    var div_armor_skill = document.getElementById("armor_skill");
    div_armor_skill.replaceChildren();
    for ([k, v] of Object.entries(k_result["eq_skill"])) {
        let lv = k_result["eq_skill"][k] + (k_result["eq_origin_skill"][k] || 0);
        let skill = `${k}+${lv}`;
        let skill_node = document.createElement("li");
        skill_node.className = "list-group-item";
        skill_node.textContent = skill;
        div_armor_skill.append(skill_node);
    }
}

function render_armor_def() {
    let def   = 0;
    let def_f = 0;
    let def_w = 0;
    let def_t = 0;
    let def_i = 0;
    let def_d = 0;

    for (let i in k_result["k_skill"]) {
        let k_skill_def_hex = k_result["k_skill"][i]["k_skill_hex"];
        if (DEF_MAP.includes(k_skill_def_hex)) {
            let v_def = k_skill_def_map[k_skill_def_hex];
            let def_value = v_def["pool"][`${k_origin["eq_pool_id"]}`];
            switch (v_def["type"]) {
                case "def":
                    def += def_value;
                    break;
                case "def_f":
                    def_f += def_value;
                    break;
                case "def_w":
                    def_w += def_value;
                    break;
                case "def_t":
                    def_t += def_value;
                    break;
                case "def_i":
                    def_i += def_value;
                    break;
                case "def_d":
                    def_d += def_value;
                    break;
                default:
                    console.log("error def type");
            }
        }
    }

    let div_def   = document.getElementById("def");
    let div_def_f = document.getElementById("def_f");
    let div_def_w = document.getElementById("def_w");
    let div_def_t = document.getElementById("def_t");
    let div_def_i = document.getElementById("def_i");
    let div_def_d = document.getElementById("def_d");

    k_result["def"]   =  def;
    k_result["def_f"] =  def_f;
    k_result["def_w"] =  def_w;
    k_result["def_t"] =  def_t;
    k_result["def_i"] =  def_i;
    k_result["def_d"] =  def_d;

    div_def.textContent   = `防御: ${k_origin["def"] + k_result["def"]}`;
    div_def_f.textContent = `火: ${k_origin["def_f"] + k_result["def_f"]}`;
    div_def_w.textContent = `水: ${k_origin["def_w"] + k_result["def_w"]}`;
    div_def_t.textContent = `雷: ${k_origin["def_t"] + k_result["def_t"]}`;
    div_def_i.textContent = `氷: ${k_origin["def_i"] + k_result["def_i"]}`;
    div_def_d.textContent = `龍: ${k_origin["def_d"] + k_result["def_d"]}`;
}

function render_armor_slot(slot) {
    document.getElementById("armor_slot").innerText = slot;
}

function render_armor_cost() {
    let armor_cost = k_result["eq_cost"];
    for (let i = 0; i < 7; i++) {
        armor_cost -= k_result["k_skill"][i]["k_skill_cost"];
    }
    document.getElementById("armor_cost").textContent = `Armor Cost: ${armor_cost}`;
}

function genExport () {
    let armor_name = k_result["eq_name"];
    let def = k_result["def"];
    let def_f = k_result["def_f"];
    let def_w = k_result["def_w"];
    let def_t = k_result["def_t"];
    let def_i = k_result["def_i"];
    let def_d = k_result["def_d"];
    let k_eq_slot = k_result["eq_k_slot"].split("");
    let slot_delta_list = k_result["eq_slot"].split("").map(function (item, idx) {
        return parseInt(k_eq_slot[idx]) - parseInt(item);
    });
    let k_skill = "";
    for ([k, v] of Object.entries(k_result["eq_skill"])){
        k_skill += `${k},${v},`;
    }

    let export_str = `${armor_name},${def},${def_f},${def_w},${def_t},${def_i},${def_d},${slot_delta_list[0]},${slot_delta_list[1]},${slot_delta_list[2]},${k_skill}`
    document.getElementById("template_result").innerText = "";
    document.getElementById("template_result").innerText = export_str;
}