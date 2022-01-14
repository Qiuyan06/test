// PCR计算器
export function calculatePCR(obj) {
	const formValues = Object.assign({}, obj)
	const DNA1 = formValues['DNAInput'] * 1
	const buffer1 = formValues['BufferInput'] * 1
	const fprimer1 = formValues['FPrimerInput'] * 1
	const rprimer1 = formValues['RPrimerInput'] * 1
	const dNTP1 = formValues['dNTPInput'] * 1
	const enzyme1 = formValues['EnzymeInput'] * 1
	const water1 = formValues['WaterInput'] * 1
	const rt = formValues['rtInput'] * 1

	const DNA2 = DNA1 * rt;
	const buffer2 = buffer1 * rt;
	const fprimer2 = fprimer1 * rt;
	const rprimer2 = rprimer1 * rt;
	const dNTP2 = dNTP1 * rt;
	const enzyme2 = enzyme1 * rt;
	const water2 = water1 * rt;
	const volume1 = (DNA1 + buffer1 + fprimer1 + rprimer1 + dNTP1 + enzyme1 + water1);
	const volume2 = volume1 * rt;

	return {
		DNAOutput: DNA2,
		WaterOutput: water2,
		BufferOutput: buffer2,
		FPrimerOutput: fprimer2,
		RPrimerOutput: rprimer2,
		dNTPOutput: dNTP2,
		EnzymeOutput: enzyme2,
		VolumeOutput: volume2,
		PCRVolumeOutput: volume1,
		rtOutput: rt
	}
}

// 质量摩尔计算器
function cal10N(n){
	return Math.pow(10,n);
}
export function calculateMgMol(obj) {
	const formValues = Object.assign({}, obj)
	let input_weight = parseFloat(formValues['input_weight'])
	let input_volume = parseFloat(formValues['input_volume']) * cal10N(parseFloat(formValues['input_volume_unit_select']))
	let desired_con = parseFloat(formValues['input_con']) * cal10N(parseFloat(formValues['input_con_unit_select']))
	let result = input_weight * input_volume * desired_con;
	const map = ['Kg','g','mg','μg','ng','pg'];
	let i = 0 ;
	result /= 1000;
	while(result < 1 && i<5){
	    result *= 1000;
	    i++;
	}
	return ""+result + map[i]
}

// 溶液稀释计算器
function calcDilute(start_con,desired_vol,desired_con) {
    const deeded_vol = desired_con/start_con * desired_vol;
    if (desired_con > start_con)
    {
        return -1;
    }
    return deeded_vol;
}
export function calculateDiluteSolution(obj) {
	const formValues = Object.assign({}, obj)
	let start_con   = parseFloat(formValues['start_con']) * cal10N(parseInt(formValues['start_con_unit_select']));
	let desired_vol = parseFloat(formValues['desired_vol']) * cal10N(parseInt(formValues['desired_vol_unit_select']));
	let desired_con = parseFloat(formValues['desired_con']) * cal10N(parseInt(formValues['desired_con_unit_select']));
	let result = calcDilute(start_con,desired_vol,desired_con);
	if(result<0){
		return 'impossible'
	}else{
		const map = ['L','mL','μL','nL'];
		let i = 0 ;
		while(result < 1 && i<4){
			result *= 1000;
			i++;
		}
		return result + map[i]
	}
}

// 溶液连续稀释计算器
export function calculateDiluteSolution2(obj) {
	const formValues = Object.assign({}, obj)
	var init_con = parseFloat(formValues['init_con']);
	var dilution_factor = parseFloat(formValues['dilution_factor']);
	if (init_con >= 0 && dilution_factor >= 0) {
		const cx = {}, logx = {}
		var concentration = init_con;
		for (let i = 0;i < 8; i++) {
			concentration = concentration / dilution_factor
			cx['c' + (i + 1)] = concentration
			logx['log' + (i + 1)] = Math.log(concentration)/Math.log(10)
		}
		return {
			...cx,
			...logx
		}
	}
}

// 分子量计算器
export function calculateMolecularWeight(obj) {
	const formValues = Object.assign({}, obj)
	var mole_input = formValues['mole_input']
	var mole_output = formValues['mole_output']
	var s = "fooStyleCss";
	s = s.replace(/([A-Z])/g,"-$1").toLowerCase();
	var atomWeight = {
	    "H" : 1.0079,
	    "He" : 4.0026,
	    "Li" : 6.941,
	    "Be" : 9.0122,
	    "B" : 10.811,
	    "C" : 12.0107,
	    "N" : 14.0067,
	    "O" : 15.9994,
	    "F" : 18.9984,
	    "Ne" : 20.1797,
	    "Na" : 22.9897,
	    "Mg" : 24.305,
	    "Al" : 26.9815,
	    "Si" : 28.0855,
	    "P" : 30.9738,
	    "S" : 32.065,
	    "Cl" : 35.453,
	    "Ar" : 39.948,
	    "K" : 39.0983,
	    "Ca" : 40.078,
	    "Sc" : 44.9559,
	    "Ti" : 47.867,
	    "V" : 50.9415,
	    "Cr" : 51.9961,
	    "Mn" : 54.938,
	    "Fe" : 55.845,
	    "Co" : 58.9332,
	    "Ni" : 58.6934,
	    "Cu" : 63.546,
	    "Zn" : 65.39,
	    "Ga" : 69.723,
	    "Ge" : 72.64,
	    "As" : 74.9216,
	    "Se" : 78.96,
	    "Br" : 79.904,
	    "Kr" : 83.8,
	    "Rb" : 85.4678,
	    "Sr" : 87.62,
	    "Y" : 88.9059,
	    "Zr" : 91.224,
	    "Nb" : 92.9064,
	    "Mo" : 95.94,
	    "Tc" : 98,
	    "Ru" : 101.07,
	    "Rh" : 102.9055,
	    "Pd" : 106.42,
	    "Ag" : 107.8682,
	    "Cd" : 112.411,
	    "In" : 114.818,
	    "Sn" : 118.71,
	    "Sb" : 121.76,
	    "Te" : 127.6,
	    "I" : 126.9045,
	    "Xe" : 131.293,
	    "Cs" : 132.9055,
	    "Ba" : 137.327,
	    "La" : 138.9055,
	    "Ce" : 140.116,
	    "Pr" : 140.9077,
	    "Nd" : 144.24,
	    "Pm" : 145,
	    "Sm" : 150.36,
	    "Eu" : 151.964,
	    "Gd" : 157.25,
	    "Tb" : 158.9253,
	    "Dy" : 162.5,
	    "Ho" : 164.9303,
	    "Er" : 167.259,
	    "Tm" : 168.9342,
	    "Yb" : 173.04,
	    "Lu" : 174.967,
	    "Hf" : 178.49,
	    "Ta" : 180.9479,
	    "W" : 183.84,
	    "Re" : 186.207,
	    "Os" : 190.23,
	    "Ir" : 192.217,
	    "Pt" : 195.078,
	    "Au" : 196.9665,
	    "Hg" : 200.59,
	    "Tl" : 204.3833,
	    "Pb" : 207.2,
	    "Bi" : 208.9804,
	    "Po" : 209,
	    "At" : 210,
	    "Rn" : 222,
	    "Fr" : 223,
	    "Ra" : 226,
	    "Ac" : 227,
	    "Th" : 232.0381,
	    "Pa" : 231.0359,
	    "U" : 238.0289,
	    "Np" : 237,
	    "Pu" : 244,
	    "Am" : 243,
	    "Cm" : 247,
	    "Bk" : 247,
	    "Cf" : 251,
	    "Es" : 252,
	    "Fm" : 257,
	    "Md" : 258,
	    "No" : 259,
	    "Lr" : 262,
	    "Rf" : 261,
	    "Db" : 262,
	    "Sg" : 266,
	    "Bh" : 264,
	    "Hs" : 277,
	    "Mt" : 268
	};
	var a = new makeArray(109)
	a[1] = new atomArray("H",1.0079)
	a[2] = new atomArray("He",4.0026)
	a[3] = new atomArray("Li",6.941)
	a[4] = new atomArray("Be",9.0122)
	a[5] = new atomArray("B",10.811)
	a[6] = new atomArray("C",12.0107)
	a[7] = new atomArray("N",14.0067)
	a[8] = new atomArray("O",15.9994)
	a[9] = new atomArray("F",18.9984)
	a[10] = new atomArray("Ne",20.1797)
	a[11] = new atomArray("Na",22.9897)
	a[12] = new atomArray("Mg",24.305)
	a[13] = new atomArray("Al",26.9815)
	a[14] = new atomArray("Si",28.0855)
	a[15] = new atomArray("P",30.9738)
	a[16] = new atomArray("S",32.065)
	a[17] = new atomArray("Cl",35.453)
	a[18] = new atomArray("Ar",39.948)
	a[19] = new atomArray("K",39.0983)
	a[20] = new atomArray("Ca",40.078)
	a[21] = new atomArray("Sc",44.9559)
	a[22] = new atomArray("Ti",47.867)
	a[23] = new atomArray("V",50.9415)
	a[24] = new atomArray("Cr",51.9961)
	a[25] = new atomArray("Mn",54.938)
	a[26] = new atomArray("Fe",55.845)
	a[27] = new atomArray("Co",58.9332)
	a[28] = new atomArray("Ni",58.6934)
	a[29] = new atomArray("Cu",63.546)
	a[30] = new atomArray("Zn",65.39)
	a[31] = new atomArray("Ga",69.723)
	a[32] = new atomArray("Ge",72.64)
	a[33] = new atomArray("As",74.9216)
	a[34] = new atomArray("Se",78.96)
	a[35] = new atomArray("Br",79.904)
	a[36] = new atomArray("Kr",83.8)
	a[37] = new atomArray("Rb",85.4678)
	a[38] = new atomArray("Sr",87.62)
	a[39] = new atomArray("Y",88.9059)
	a[40] = new atomArray("Zr",91.224)
	a[41] = new atomArray("Nb",92.9064)
	a[42] = new atomArray("Mo",95.94)
	a[43] = new atomArray("Tc",98)
	a[44] = new atomArray("Ru",101.07)
	a[45] = new atomArray("Rh",102.9055)
	a[46] = new atomArray("Pd",106.42)
	a[47] = new atomArray("Ag",107.8682)
	a[48] = new atomArray("Cd",112.411)
	a[49] = new atomArray("In",114.818)
	a[50] = new atomArray("Sn",118.71)
	a[51] = new atomArray("Sb",121.76)
	a[52] = new atomArray("Te",127.6)
	a[53] = new atomArray("I",126.9045)
	a[54] = new atomArray("Xe",131.293)
	a[55] = new atomArray("Cs",132.9055)
	a[56] = new atomArray("Ba",137.327)
	a[57] = new atomArray("La",138.9055)
	a[58] = new atomArray("Ce",140.116)
	a[59] = new atomArray("Pr",140.9077)
	a[60] = new atomArray("Nd",144.24)
	a[61] = new atomArray("Pm",145)
	a[62] = new atomArray("Sm",150.36)
	a[63] = new atomArray("Eu",151.964)
	a[64] = new atomArray("Gd",157.25)
	a[65] = new atomArray("Tb",158.9253)
	a[66] = new atomArray("Dy",162.5)
	a[67] = new atomArray("Ho",164.9303)
	a[68] = new atomArray("Er",167.259)
	a[69] = new atomArray("Tm",168.9342)
	a[70] = new atomArray("Yb",173.04)
	a[71] = new atomArray("Lu",174.967)
	a[72] = new atomArray("Hf",178.49)
	a[73] = new atomArray("Ta",180.9479)
	a[74] = new atomArray("W",183.84)
	a[75] = new atomArray("Re",186.207)
	a[76] = new atomArray("Os",190.23)
	a[77] = new atomArray("Ir",192.217)
	a[78] = new atomArray("Pt",195.078)
	a[79] = new atomArray("Au",196.9665)
	a[80] = new atomArray("Hg",200.59)
	a[81] = new atomArray("Tl",204.3833)
	a[82] = new atomArray("Pb",207.2)
	a[83] = new atomArray("Bi",208.9804)
	a[84] = new atomArray("Po",209)
	a[85] = new atomArray("At",210)
	a[86] = new atomArray("Rn",222)
	a[87] = new atomArray("Fr",223)
	a[88] = new atomArray("Ra",226)
	a[89] = new atomArray("Ac",227)
	a[90] = new atomArray("Th",232.0381)
	a[91] = new atomArray("Pa",231.0359)
	a[92] = new atomArray("U",238.0289)
	a[93] = new atomArray("Np",237)
	a[94] = new atomArray("Pu",244)
	a[95] = new atomArray("Am",243)
	a[96] = new atomArray("Cm",247)
	a[97] = new atomArray("Bk",247)
	a[98] = new atomArray("Cf",251)
	a[99] = new atomArray("Es",252)
	a[100] = new atomArray("Fm",257)
	a[101] = new atomArray("Md",258)
	a[102] = new atomArray("No",259)
	a[103] = new atomArray("Lr",262)
	a[104] = new atomArray("Rf",261)
	a[105] = new atomArray("Db",262)
	a[106] = new atomArray("Sg",266)
	a[107] = new atomArray("Bh",264)
	a[108] = new atomArray("Hs",277)
	a[109] = new atomArray("Mt",268)

	var atomString = ""
	var badData=false
	var numAtoms=new Array(0,0,0,0,0,0,0,0,0,0)
	var ANofAtom=new Array(0,0,0,0,0,0,0,0,0,0)
	var MolarMass="0"
	var printS=""
	var formula=""
	var numElems=""
	var capsLockOn=-1

	function cmpd(numAtoms,ANofAtom,MM,printString) {
	    this.numAtoms=numAtoms
	    this.ANofAtom=ANofAtom
	    this.MM=MM
	    this.printString=printString
	}

	var compound = new cmpd(numAtoms,ANofAtom,MolarMass,printS)

	function parseFormula(formula) {
	    var index = 0, x=0, y=0, c1=0, marker1=0, marker2=-1, loopCount=0;

	    var badData = false;
	    var multiplier=1
	    var a1 = new Array(0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0)
	    var a2 = new Array(0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0)
	    while (index <= formula.length - 1 && !badData) {
	        var an = findAN(formula.substring(index,index+2))
	        if (an == -1) {
	            an = findAN(formula.substring(index,index+1))
	            y=1
	        }else {
	            y=2
	        }
	        if (an > -1) {
	            marker2 = -1
	            for (var c2=0; c2<=9; c2++)  {
	                if (a2[c2] == an) {
	                    marker2 = c2; break
	                }
	            }
	            if (marker2>=0) {marker1=marker2; loopCount-=1}
	            else marker1=loopCount
	            index += y
	            a2[marker1] = an
	            var OK = true
	            var c3 = 0
	            while (OK && index+c3 <= formula.length-1)  {
	                an = findNum(formula.substring(index+c3, index+c3+1))
	                if (an >= 0) c3++; else OK = false
	            }
	            if (c3>0) {
	                if (marker2>=0) {
	                    a1[marker1] += parseInt(formula.substring(index, index+c3))*multiplier
	                }
	                else {
	                    a1[marker1] = parseInt(formula.substring(index, index+c3))*multiplier
	                }
	            }
	            else {
	                if (marker2>=0) a1[marker1] += 1*multiplier
	                else a1[marker1] = 1*multiplier
	            }
	            index += c3;
	            loopCount++
	        }
	        else {
	            var symbolIndex = "[]() ".indexOf(formula.substring(index,index+1));
	            if (symbolIndex==-1) {
	                badData=true;break;
	                return ;
	            }
	            if (symbolIndex==0 || symbolIndex==2) {
	                if (symbolIndex==2) {
	                    var zz=0
	                    for (x=index;x<=formula.length-1;x++) {
	                        if (formula.substring(x,x+1)==")"){zz=x; break}
	                    }
	                }
	                else {
	                    for (x=index;x<=formula.length-1;x++) {
	                        if (formula.substring(x,x+1)=="]"){zz=x; break}
	                    }
	                }
	                var c4=1;OK=true
	                while (OK && zz+c4 <= formula.length-1)  {
	                    var AN1 = findNum(formula.substring(zz+c4, zz+c4+1))
	                    if (AN1 >= 0) c4++; else OK = false
	                }
	                if (c4>1) {
	                    var z=parseInt(formula.substring(1+zz, c4+zz));
	                    multiplier=multiplier*z
	                }
	                index++
	            }
	            if (symbolIndex==1 || symbolIndex==3)  {
	                var c5=1;OK=true
	                while (OK && index+c5 <= formula.length-1)  {
	                    var AN1 = findNum(formula.substring(index+c5, index+c5+1))
	                    if (AN1 >= 0) c5++; else OK = false
	                }
	                if (c5>1) {
	                    multiplier=
	                    Math.round(multiplier /
	                    parseInt(formula.substring(index+1,index+c5)))
	                }
	                index+=c5
	            }
	            if (symbolIndex==4)  {
	                var c6=1; OK=true
	                while (OK && index+c6 <= formula.length-1)  {
	                    var AN1 = findNum(formula.substring(index+c6, index+c6+1))
	                    if (AN1 >= 0) c6++; else OK = false
	                }
	                if (c6>1) {
	                    multiplier *= parseInt(formula.substring(index+1, index+c6))
	                }
	                index+=c6
	            }
	        }
	    }
	    numElems = loopCount-1
	    for (var i=0; i<=numElems; i++)  {
	        numAtoms[i] = a1[i]
	        ANofAtom[i] = a2[i]
	    }

	}

	function findAN(aSym) {
	    var an = 0
	    if (aSym.length == 1) aSym +="*"
	    var x = atomString .indexOf(aSym)
	    an = (x == -1) ?  x : (x / 2) + 1;
	    return an;
	}

	function findNum(ch) {
	    var numstring = "0123456789"
	    var x = numstring.indexOf(ch)
	    return x
	}

	function calcMolarMass()  {
	    var mass = 0
	    for (var i=0; i<=numElems; i++)  {
	        var x =ANofAtom[i]
	        mass += a[x]["mass"]*numAtoms[i]
	    }
	    mass = Math.round(mass*100)/100;
	    return mass;
	}

	function atomArray(symbol, mass) {
	    this.symbol = symbol
	    this.mass = mass
	}

	function makeArray(arraySize) {
	    this.length = arraySize
	    for (var i=1; i <= arraySize; i++) {
	    this[i] = 0
	    }
	    return this
	}

	function makeAtomString()  {
	    for (var i=1; i <= a.length; i++)  {
	        atomString += a[i]["symbol"]
	        if (a[i]["symbol"].length == 1) atomString += "*"
	    }
	    return atomString
	}

	function calc(formula){
	    badData=false
	    makeAtomString();
	    parseFormula(formula);
	    if (badData==false) {

	        var mass = calcMolarMass();

	        return mass.toFixed(2) + ' g/mol';

	    }else{

	        return "化学式有误";
	    }
	}

	return calc(mole_input)
}

// 温度转换计算器
export function calculateTemperature(obj) {
	const formValues = Object.assign({}, obj)
	const value = parseFloat(formValues.inputValue)
	if( (value >= 0) && (formValues.inputValue.indexOf("-") != -1) ) {
	  value = -value;
	}
	switch(formValues.unitValue) {
		case 'c':
			if(!(value < -273.15) ) {
			  let tempK = value + 273.15
			  let tempF = 32 + (value * 9 / 5)
			  let tempRa = tempK*1.8
			  let tempRe = value/1.25
			  return {
				  tempC: value,
				  tempK,
				  tempF,
				  tempRa,
				  tempRe,
			  }
			} else {
				return {
					tempC: 'error',
					tempK: 'error',
					tempF: 'error',
					tempRa: 'error',
					tempRe: 'error',
				}
			}
		case 'f':
			if(!(value < -459.666666) ) {
			  var tempC = (value - 32) * 5 / 9
			  var tempK = tempC + 273.15
			  var tempRa = tempK*1.8
			  var tempRe = tempC/1.25
			  return {
				  tempC,
				  tempF: value,
				  tempK,
				  tempRa,
				  tempRe,
			  }
			} else {
				return {
					tempC: 'error',
					tempK: 'error',
					tempF: 'error',
					tempRa: 'error',
					tempRe: 'error',
				}
			}
		case 'k':
			if(!(value < 0) ) {
			  var tempC = value - 273.15
			  var tempF = 32 + (tempC * 9 / 5)
			  var tempRa = value*1.8
			  var tempRe = tempC/1.25
			  return {
				  tempC,
				  tempF,
				  tempK: value,
				  tempRa,
				  tempRe,
			  }
			} else {
				return {
					tempC: 'error',
					tempK: 'error',
					tempF: 'error',
					tempRa: 'error',
					tempRe: 'error',
				}
			}
		case 'ra':
			if(!(value < 0) ) {
			  var tempK = value/1.8
			  var tempC = tempK  - 273.15
			  var tempF = 32 + (tempC * 9 / 5)
			  var tempRe = tempC/1.25
			  return {
				  tempC,
				  tempF,
				  tempK,
				  tempRa: value,
				  tempRe,
			  }
			} else {
				return {
					tempC: 'error',
					tempK: 'error',
					tempF: 'error',
					tempRa: 'error',
					tempRe: 'error',
				}
			}
		case 're':
			if(!(value < 0) ) {
			  var tempC = value*1.25
			  var tempK = tempC + 273.15
			  var tempF = 32 + (tempC * 9 / 5)
			  var tempRa = tempK*1.8
			  return {
				  tempC,
				  tempF,
				  tempK,
				  tempRa,
				  tempRe: value,
			  }
			} else {
				return {
					tempC: 'error',
					tempK: 'error',
					tempF: 'error',
					tempRa: 'error',
					tempRe: 'error',
				}
			}
	}
}

// 质量/重量换算器
export function calculateSwitchZl(obj) {
	const formValues = Object.assign({}, obj)
	const value = parseFloat(formValues.inputValue)
	if( (value >= 0) && (formValues.inputValue.indexOf("-") != -1) ) {
	  value = -value;
	}
	const mapper = [
		{ key: 't', value: 0.000001 },
		{ key: 'kg', value: 0.001 },
		{ key: 'g', value: 1 },
		{ key: 'mg', value: 1000 },
		{ key: 'μg', value: 1000000 },
		{ key: 'ng', value: 1000000000 },
		{ key: 'pg', value: 1000000000000 },
		{ key: 'st', value: 0.000157473044418 },
		{ key: 'lb', value: 0.00220462262185 },
		{ key: 'oz', value: 0.0352739619496 },
		{ key: 'ct', value: 5 },
		{ key: 'amu/u', value: 6.02214129374 * cal10N(23) }
	]
	switch(formValues.unitValue) {
		case 't':
			if(value) {
				let base = mapper.filter(item => item.key === 't')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'kg':
			if(value) {
				let base = mapper.filter(item => item.key === 'kg')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'g':
			if(value) {
				let base = mapper.filter(item => item.key === 'g')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'mg':
			if(value) {
				let base = mapper.filter(item => item.key === 'mg')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'μg':
			if(value) {
				let base = mapper.filter(item => item.key === 'μg')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'ng':
			if(value) {
				let base = mapper.filter(item => item.key === 'ng')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'pg':
			if(value) {
				let base = mapper.filter(item => item.key === 'pg')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'st':
			if(value) {
				let base = mapper.filter(item => item.key === 'st')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'lb':
			if(value) {
				let base = mapper.filter(item => item.key === 'lb')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'oz':
			if(value) {
				let base = mapper.filter(item => item.key === 'oz')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'ct':
			if(value) {
				let base = mapper.filter(item => item.key === 'ct')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'amu/u':
			if(value) {
				let base = mapper.filter(item => item.key === 'amu/u')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
	}
}

// 压力换算器
export function calculateSwitchYl(obj) {
	const formValues = Object.assign({}, obj)
	const value = parseFloat(formValues.inputValue)
	if( (value >= 0) && (formValues.inputValue.indexOf("-") != -1) ) {
	  value = -value;
	}
	const mapper = [
		{ key: 'bar', value: 1 },
		{ key: 'psi', value: 14.5037737734 },
		{ key: 'kPa', value: 100 },
		{ key: 'hPa', value: 1000 },
		{ key: 'MPa', value: 0.1 },
		{ key: 'mbar', value: 1000 },
		{ key: 'Pa', value: 100000 },
		{ key: 'kgf/cm2', value: 1.02 },
		{ key: 'kgf/m2', value: 10200 },
		{ key: 'N/m2', value: 100000 },
		{ key: 'kN/m2', value: 100 },
		{ key: 'MN/m2', value: 0.1 },
		{ key: 'N/cm2', value: 10 },
		{ key: 'torr', value: 750.061682704 },
		{ key: 'mH2O', value: 10.1971621298 },
		{ key: 'atm', value: 0.986923266716 }
	]
	switch(formValues.unitValue) {
		case 'bar':
			if(value) {
				let base = mapper.filter(item => item.key === 'bar')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'psi':
			if(value) {
				let base = mapper.filter(item => item.key === 'psi')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'kPa':
			if(value) {
				let base = mapper.filter(item => item.key === 'kPa')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'hPa':
			if(value) {
				let base = mapper.filter(item => item.key === 'hPa')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'MPa':
			if(value) {
				let base = mapper.filter(item => item.key === 'MPa')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'mbar':
			if(value) {
				let base = mapper.filter(item => item.key === 'mbar')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'Pa':
			if(value) {
				let base = mapper.filter(item => item.key === 'Pa')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'kgf/cm2':
			if(value) {
				let base = mapper.filter(item => item.key === 'kgf/cm2')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'kgf/m2':
			if(value) {
				let base = mapper.filter(item => item.key === 'kgf/m2')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'N/m2':
			if(value) {
				let base = mapper.filter(item => item.key === 'N/m2')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'kN/m2':
			if(value) {
				let base = mapper.filter(item => item.key === 'kN/m2')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'MN/m2':
			if(value) {
				let base = mapper.filter(item => item.key === 'MN/m2')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'N/cm2':
			if(value) {
				let base = mapper.filter(item => item.key === 'N/cm2')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'torr':
			if(value) {
				let base = mapper.filter(item => item.key === 'torr')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'mH2O':
			if(value) {
				let base = mapper.filter(item => item.key === 'mH2O')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'atm':
			if(value) {
				let base = mapper.filter(item => item.key === 'atm')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
	}
}

// 体积换算器
export function calculateSwitchTj(obj) {
	const formValues = Object.assign({}, obj)
	const value = parseFloat(formValues.inputValue)
	if( (value >= 0) && (formValues.inputValue.indexOf("-") != -1) ) {
	  value = -value;
	}
	const mapper = [
		{ key: 'm3', value: 1 },
		{ key: 'hL', value: 10 },
		{ key: 'l', value: 1000 },
		{ key: 'dL', value: 10000 },
		{ key: 'mL', value: 1000000 },
		{ key: 'μL', value: 1000000000 },
		{ key: 'gal', value: 264.172052358 },
		{ key: 'pt', value: 2113.37641887 },
		{ key: 'oz', value: 33814.0227018 },
		{ key: 'in3', value: 61023.7440947 }
	]
	switch(formValues.unitValue) {
		case 'm3':
			if(value) {
				let base = mapper.filter(item => item.key === 'm3')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'hL':
			if(value) {
				let base = mapper.filter(item => item.key === 'hL')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'l':
			if(value) {
				let base = mapper.filter(item => item.key === 'l')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'dL':
			if(value) {
				let base = mapper.filter(item => item.key === 'dL')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'mL':
			if(value) {
				let base = mapper.filter(item => item.key === 'mL')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'μL':
			if(value) {
				let base = mapper.filter(item => item.key === 'μL')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'gal':
			if(value) {
				let base = mapper.filter(item => item.key === 'gal')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'pt':
			if(value) {
				let base = mapper.filter(item => item.key === 'pt')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'oz':
			if(value) {
				let base = mapper.filter(item => item.key === 'oz')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'in3':
			if(value) {
				let base = mapper.filter(item => item.key === 'in3')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
	}
}

// 长度换算器
export function calculateSwitchCd(obj) {
	const formValues = Object.assign({}, obj)
	const value = parseFloat(formValues.inputValue)
	if( (value >= 0) && (formValues.inputValue.indexOf("-") != -1) ) {
	  value = -value;
	}
	const mapper = [
		{ key: 'm', value: 1 },
		{ key: 'dm', value: 10 },
		{ key: 'cm', value: 100 },
		{ key: 'mm', value: 1000 },
		{ key: 'μm', value: 1000000 },
		{ key: 'nm', value: 1000000000 },
		{ key: 'Å', value: 10000000000 },
		{ key: 'yd', value: 1.09361329834 },
		{ key: 'ft', value: 3.28083989501 },
		{ key: 'in', value: 39.3700787402 }
	]
	switch(formValues.unitValue) {
		case 'm':
			if(value) {
				let base = mapper.filter(item => item.key === 'm')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'dm':
			if(value) {
				let base = mapper.filter(item => item.key === 'dm')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'cm':
			if(value) {
				let base = mapper.filter(item => item.key === 'cm')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'mm':
			if(value) {
				let base = mapper.filter(item => item.key === 'mm')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'μm':
			if(value) {
				let base = mapper.filter(item => item.key === 'μm')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'nm':
			if(value) {
				let base = mapper.filter(item => item.key === 'nm')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'Å':
			if(value) {
				let base = mapper.filter(item => item.key === 'Å')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'yd':
			if(value) {
				let base = mapper.filter(item => item.key === 'yd')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'ft':
			if(value) {
				let base = mapper.filter(item => item.key === 'ft')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'in':
			if(value) {
				let base = mapper.filter(item => item.key === 'in')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
	}
}

// 流量换算器
export function calculateSwitchLl(obj) {
	const formValues = Object.assign({}, obj)
	const value = parseFloat(formValues.inputValue)
	if( (value >= 0) && (formValues.inputValue.indexOf("-") != -1) ) {
	  value = -value;
	}
	const mapper = [
		{ key: 'cm3/s', value: 1 },
		{ key: 'cm3/min', value: 60 },
		{ key: 'L/s', value: 0.001 },
		{ key: 'L/min', value: 0.06 },
		{ key: 'L/h', value:  3.6 },
		{ key: 'cu ft./s', value: 0.0000353146667198 },
		{ key: 'cu ft./min', value: 0.00211888000318 },
		{ key: 'cu ft./h', value: 0.127132800191 }
	]
	switch(formValues.unitValue) {
		case 'cm3/s':
			if(value) {
				let base = mapper.filter(item => item.key === 'cm3/s')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'cm3/min':
			if(value) {
				let base = mapper.filter(item => item.key === 'cm3/min')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'L/s':
			if(value) {
				let base = mapper.filter(item => item.key === 'L/s')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'L/min':
			if(value) {
				let base = mapper.filter(item => item.key === 'L/min')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'L/h':
			if(value) {
				let base = mapper.filter(item => item.key === 'L/h')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'cu ft./s':
			if(value) {
				let base = mapper.filter(item => item.key === 'cu ft./s')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'cu ft./min':
			if(value) {
				let base = mapper.filter(item => item.key === 'cu ft./min')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'cu ft./h':
			if(value) {
				let base = mapper.filter(item => item.key === 'cu ft./h')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
	}
}

// 密度换算器
export function calculateSwitchMd(obj) {
	const formValues = Object.assign({}, obj)
	const value = parseFloat(formValues.inputValue)
	if( (value >= 0) && (formValues.inputValue.indexOf("-") != -1) ) {
	  value = -value;
	}
	const mapper = [
		{ key: 'g/mL', value: 1 },
		{ key: 'kg/L', value: 1 },
		{ key: 'g/m3', value: 1000000 },
		{ key: 'kg/m3', value: 1000 },
		{ key: 'mg/m3', value:  1000000000 }
	]
	switch(formValues.unitValue) {
		case 'g/mL':
			if(value) {
				let base = mapper.filter(item => item.key === 'g/mL')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'kg/L':
			if(value) {
				let base = mapper.filter(item => item.key === 'kg/L')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'g/m3':
			if(value) {
				let base = mapper.filter(item => item.key === 'g/m3')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'kg/m3':
			if(value) {
				let base = mapper.filter(item => item.key === 'kg/m3')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'mg/m3':
			if(value) {
				let base = mapper.filter(item => item.key === 'mg/m3')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
	}
}

// 力矩换算器
export function calculateSwitchLj(obj) {
	const formValues = Object.assign({}, obj)
	const value = parseFloat(formValues.inputValue)
	if( (value >= 0) && (formValues.inputValue.indexOf("-") != -1) ) {
	  value = -value;
	}
	const mapper = [
		{ key: 'Nm', value: 1 },
		{ key: 'Ncm', value: 100 },
		{ key: 'dyn m', value: 100000 },
		{ key: 'dyn cm', value: 10000000 },
		{ key: 'kgf m', value:  0.101971621298 },
		{ key: 'kgf cm', value:  10.1971621298 },
		{ key: 'gf m', value:  101.971621298 },
		{ key: 'gf cm', value:  10197.1621298 },
		{ key: 'o zf ft', value:  11.800994078 },
		{ key: 'o zf in', value:  141.611928936 },
		{ key: 'lbf ft', value:  0.73756212117 },
		{ key: 'lbf in', value:  8.85074545406 },
	]
	switch(formValues.unitValue) {
		case 'Nm':
			if(value) {
				let base = mapper.filter(item => item.key === 'Nm')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'Ncm':
			if(value) {
				let base = mapper.filter(item => item.key === 'Ncm')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'dyn m':
			if(value) {
				let base = mapper.filter(item => item.key === 'dyn m')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'dyn cm':
			if(value) {
				let base = mapper.filter(item => item.key === 'dyn cm')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'kgf m':
			if(value) {
				let base = mapper.filter(item => item.key === 'kgf m')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'kgf cm':
			if(value) {
				let base = mapper.filter(item => item.key === 'kgf cm')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'gf m':
			if(value) {
				let base = mapper.filter(item => item.key === 'gf m')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'gf cm':
			if(value) {
				let base = mapper.filter(item => item.key === 'gf cm')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'o zf ft':
			if(value) {
				let base = mapper.filter(item => item.key === 'o zf ft')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'o zf in':
			if(value) {
				let base = mapper.filter(item => item.key === 'o zf in')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'lbf ft':
			if(value) {
				let base = mapper.filter(item => item.key === 'lbf ft')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
		case 'lbf in':
			if(value) {
				let base = mapper.filter(item => item.key === 'lbf in')[0].value
				let result = mapper.map(item => item.value / base * value)
				return result
			}
	}
}

// 饱和蒸汽压实际蒸汽压计算器
export function calculatePressure(obj){
	const formValues = Object.assign({}, obj)
	const T=parseFloat(formValues.temp)
	const RH=parseFloat(formValues.damp)
	let result = {}
	result.pressure_s=Math.round(6.11*Math.pow(10, ((7.5*T)/(T+237.3)))*1000)/1000
	result.pressure_a=Math.round((result.pressure_s)*RH/100*1000)/1000
	return result
}


function ltrim ( s )
{
	return s.replace( /^\s*/, "" );
}

function rtrim ( s )
{
	return s.replace( /\s*$/, "" );
}

function trim ( s )
{
	return rtrim(ltrim(s));
}

function AdjustValue(value, minimum, maximum) {
	const tvalue = trim(value);
	if(isNaN(tvalue)) return null;  // not a number
	if (tvalue=="")
		var V = 0.0;					// blank line is a zero
	else
		var V = parseFloat(tvalue);     // turn it into a number
	if (V < minimum) return null;
	if (V > maximum) return null;
	return V;							// return a number
}

function RoundOff(number, decimals) {	// rounds off the number to the number of decimals specified and returns a string
	if(isNaN(number)) return number;
	if(number == Number.POSITIVE_INFINITY) return number;
	if(number == Number.NEGATIVE_INFINITY) return number;
	let i = 0;
	let e = 1.0 * number;
	while (i<decimals) {
		e = 10.0 * e ;
		i++;
	}
	const result = String(Math.round(e));  // make it an integer and then a string
	let b = result.length-decimals;
	if(b>=0) {
		let f = result.substring(0, b);
		if (f=="") f="0";
		return f + "." + result.substring(b);
	}
	let f = "";
	for(b=-b; b>0; b--) f = f + "0";
	return "0." + f + result;
}

export function calculateMD(obj){
	const t = Object.assign({}, obj)
	const rd = AdjustValue(t.ResinDensity, 0.01, 20.0);
	const fd = AdjustValue(t.FiberDensity, 0.01, 20.0);
	let result = {}
	if(fd==null){
		uni.showToast({
			title: '纤维密度必须是一个数字：0.01至20',
			icon: 'none'
		});
		return false
	}
	if(rd==null){
		uni.showToast({
			title: '树脂密度必须是一个数字：0.01至20',
			icon: 'none'
		});
		return false
	}
	switch (t.type) {
		case 'fiberVolume':
			if(t.value){
				const fvf = AdjustValue(t.value, 0.1, 100.0);
				if(fvf==null) {
					uni.showToast({
						title: '纤维体积必须是数字: 0.1 到 100.0',
						icon: 'none'
					});
					return false
				}
				const rvf = 100.0 - fvf;   // resin volume fraction
				const fw = (fvf/100.0) * fd;    // fiber weight for one cc total
				const rw = (rvf/100.0) * rd;     // resin weight
				const tw = fw + rw;      // total weight grams - also density grams per cc
				const fwf = (fw/tw)*100.0;       // fiber weight fraction
				const rwf = (rw/tw)*100.0;       // resin weight fraction
				result.ResinVolume = RoundOff(rvf, 1);
				result.FiberWeight = RoundOff(fwf, 1);
				result.ResinWeight = RoundOff(rwf, 1);
				result.CompositeDensity = RoundOff(tw, 2);
			}
			break
		case 'resinVolume':
			if(t.value){
				const rvf = AdjustValue(t.value, 0.1, 100.0);
				if(rvf==null) {
					uni.showToast({
						title: '树脂体积必须是数字: 0.1 到 100.0',
						icon: 'none'
					});
					return false
				}

				const fvf = 100.0 - rvf;   // resin volume fraction
				const fw = (fvf/100.0) * fd;    // fiber weight for one cc total
				const rw = (rvf/100.0) * rd;     // resin weight
				const tw = fw + rw;      // total weight grams - also density grams per cc
				const fwf = (fw/tw)*100.0;       // fiber weight fraction
				const rwf = (rw/tw)*100.0;       // resin weight fraction
				result.FiberVolume = RoundOff(fvf, 1);
				result.FiberWeight = RoundOff(fwf, 1);
				result.ResinWeight = RoundOff(rwf, 1);
				result.CompositeDensity = RoundOff(tw, 2);
			}
			break
		case 'fiberWeight':
			if(t.value){
				const fwf = AdjustValue(t.value, 0.1, 100.0);
				if(fwf==null) {
					uni.showToast({
						title: '纤维重量必须是数字: 0.1 到 100.0',
						icon: 'none'
					});
					return false
				}

				const rwf = 100.0 - fwf;	// resin weight fraction
				const fv = (fwf/100.0) / fd;    // fiber volume for one g total
				const rv = (rwf/100.0) / rd;     // resin volume
				const tv = fv + rv;      // total volume grams - also inverse density ccs per gram
				const fvf = (fv/tv)*100.0;       // fiber volume fraction
				const rvf = (rv/tv)*100.0;       // resin volume fraction
				const tw = 1.0/tv;				// density
				result.ResinWeight = RoundOff(rwf, 1);
				result.FiberVolume = RoundOff(fvf, 1);
				result.ResinVolume = RoundOff(rvf, 1);
				result.CompositeDensity = RoundOff(tw, 2);
			}
			break
		case 'resinWeight':
			if(t.value){
				const rwf = AdjustValue(t.value, 0.1, 100.0);
				if(rwf==null){
					uni.showToast({
						title: '树脂重量是一个数字：0.1至100.0',
						icon: 'none'
					});
					return false
				}

				const fwf = 100.0 - rwf;	// fiber weight fraction
				const fv = (fwf/100.0) / fd;    // fiber volume for one g total
				const rv = (rwf/100.0) / rd;     // resin volume
				const tv = fv + rv;      // total volume grams - also inverse density ccs per gram
				const fvf = (fv/tv)*100.0;       // fiber volume fraction
				const rvf = (rv/tv)*100.0;       // resin volume fraction
				const tw = 1.0/tv;				// density
				result.FiberWeight = RoundOff(fwf, 1);
				result.FiberVolume = RoundOff(fvf, 1);
				result.ResinVolume = RoundOff(rvf, 1);
				result.CompositeDensity = RoundOff(tw, 2);
			}
			break
	}
	return result

	if(t.RadioGroup1[0].checked) {
		const fvf = AdjustValue(t.FiberVolume.value, 0.1, 100.0);
		if(fvf==null) return Error(t.FiberVolume, "错误：纤维含量 - 必须是数字: 0.1 到 100.0");
		const rvf = 100.0 - fvf;   // resin volume fraction
		const fw = (fvf/100.0) * fd;    // fiber weight for one cc total
		const rw = (rvf/100.0) * rd;     // resin weight
		const tw = fw + rw;      // total weight grams - also density grams per cc
		const fwf = (fw/tw)*100.0;       // fiber weight fraction
		const rwf = (rw/tw)*100.0;       // resin weight fraction
		t.ResinVolume.value = RoundOff(rvf, 1);
		t.FiberWeight.value = RoundOff(fwf, 1);
		t.ResinWeight.value = RoundOff(rwf, 1);
	}
	else if(t.RadioGroup1[2].checked) {
		const rvf = AdjustValue(t.ResinVolume.value, 0.1, 100.0);
		if(rvf==null) return Error(t.ResinVolume, "Error: Resin Volume Fraction - Must be a number: 0.1 to 100.0");
		const fvf = 100.0 - rvf;   // resin volume fraction
		const fw = (fvf/100.0) * fd;    // fiber weight for one cc total
		const rw = (rvf/100.0) * rd;     // resin weight
		const tw = fw + rw;      // total weight grams - also density grams per cc
		const fwf = (fw/tw)*100.0;       // fiber weight fraction
		const rwf = (rw/tw)*100.0;       // resin weight fraction
		t.FiberVolume.value = RoundOff(fvf, 1);
		t.FiberWeight.value = RoundOff(fwf, 1);
		t.ResinWeight.value = RoundOff(rwf, 1);
	}
	else if(t.RadioGroup1[1].checked) {
		const fwf = AdjustValue(t.FiberWeight.value, 0.1, 100.0);
		if(fwf==null) return Error(t.FiberWeight, "错误：纤维重量分数 - 必须是数字: 0.1 到 100.0");
		const rwf = 100.0 - fwf;	// resin weight fraction
		const fv = (fwf/100.0) / fd;    // fiber volume for one g total
		const rv = (rwf/100.0) / rd;     // resin volume
		const tv = fv + rv;      // total volume grams - also inverse density ccs per gram
		const fvf = (fv/tv)*100.0;       // fiber volume fraction
		const rvf = (rv/tv)*100.0;       // resin volume fraction
		const tw = 1.0/tv;				// density
		t.ResinWeight.value = RoundOff(rwf, 1);
		t.FiberVolume.value = RoundOff(fvf, 1);
		t.ResinVolume.value = RoundOff(rvf, 1);
	}
	else if(t.RadioGroup1[3].checked) {
		const rwf = AdjustValue(t.ResinWeight.value, 0.1, 100.0);
		if(rwf==null) return Error(t.ResinWeight, "错误：树脂质量分数 - 必须是一个数字：0.1至100.0");
		const fwf = 100.0 - rwf;	// fiber weight fraction
		const fv = (fwf/100.0) / fd;    // fiber volume for one g total
		const rv = (rwf/100.0) / rd;     // resin volume
		const tv = fv + rv;      // total volume grams - also inverse density ccs per gram
		const fvf = (fv/tv)*100.0;       // fiber volume fraction
		const rvf = (rv/tv)*100.0;       // resin volume fraction
		const tw = 1.0/tv;				// density
		t.FiberWeight.value = RoundOff(fwf, 1);
		t.FiberVolume.value = RoundOff(fvf, 1);
		t.ResinVolume.value = RoundOff(rvf, 1);
	}
	else {
		t.StatusBar.value = "Enter a fiber or resin - volume or weight fraction";
		return;
	}
	t.CompositeDensity.value = RoundOff(tw, 2);

	t.StatusBar.value="有效的结果"; 				// clear status bar and results
}

export function twas(obj){
	const form = Object.assign({}, obj)
	var time1=parseFloat(form.time1);
	var time2=parseFloat(form.time2);
	var time3=parseFloat(form.time3);
	var time4=parseFloat(form.time4);
	var time5=parseFloat(form.time5);

	var concentration1=parseFloat(form.concentration1);
	var concentration2=parseFloat(form.concentration2);
	var concentration3=parseFloat(form.concentration3);
	var concentration4=parseFloat(form.concentration4);
	var concentration5=parseFloat(form.concentration5);

	var totaltime=parseFloat(form.totaltime);

	if(!time1){form.time1="0";}
	if(!time2){form.time2="0";}
	if(!time3){form.time3="0";}
	if(!time4){form.time4="0";}
	if(!time5){form.time5="0";}


	if(!concentration1){form.concentration1="0";}
	if(!concentration2){form.concentration2="0";}
	if(!concentration3){form.concentration3="0";}
	if(!concentration4){form.concentration4="0";}
	if(!concentration5){form.concentration5="0";}

	if(!totaltime){form.totaltime="0";}

	time1=parseFloat(form.time1);
	time2=parseFloat(form.time2);
	time3=parseFloat(form.time3);
	time4=parseFloat(form.time4);
	time5=parseFloat(form.time5);

	concentration1=parseFloat(form.concentration1);
	concentration2=parseFloat(form.concentration2);
	concentration3=parseFloat(form.concentration3);
	concentration4=parseFloat(form.concentration4);
	concentration5=parseFloat(form.concentration5);

	totaltime=parseFloat(form.totaltime);


	form.twa="0";

	if(totaltime!=0){
		form.twa=(((time1*concentration1)+(time2*concentration2)+(time3*concentration3)+(time4*concentration4)+(time5*concentration5))/totaltime);
	}
	return form
}

export function xc(obj){
	const form = Object.assign({}, obj)
	var res1;
	var HCO3 = parseFloat(form.hco3);
	var PaCO2 = parseFloat(form.paco2);
	//calculation for Radians Per Minute
	//http://www.ab126.com/forum/ghgh.htm
	res1 = 6.1 + Math.log((HCO3)/(0.0301*PaCO2));
	return res1
}

// 上传图片地址
export function uploadImageUrl() {
  return '/iot-ysa-base/uploadCompressionImage'
}
