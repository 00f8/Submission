-- Game Objects
_G["PlayerData"] = {};
_G["BanData"] = {};
_G["ModBanData"] = {};

Trades = {};

defaultFace = {};

-- Services
local ds = game:GetService("DataStoreService");
local InsertService = game:GetService("InsertService");
local rep = game:GetService("ReplicatedStorage");
local players = game:GetService("Players");
local sss = game:GetService("ServerScriptService");
local mps = game:GetService("MarketplaceService");
local https = game:GetService("HttpService");
local runService = game:GetService("RunService");
local badgeService = game:GetService("BadgeService");

-- DataStores

-- Objects
local rModules = rep:WaitForChild("Modules");
local Scripts = sss:WaitForChild("Scripts");
local Remotes = rep:WaitForChild("Remotes");
local exclusiveItems = rep:WaitForChild("Exclusive Items For Shane");
local abs = {'K', 'M','B','T','Qd','Qn', 'Sx', 'Sp', 'O', 'N'};
local admins = {[1] = true, [2] = true};
local mods = {[1] = true, [2] = true, [3] = true, [4] = true, [6] = true, [9] = true, [99] = true, [00] = true, [000] = true, [0000] = true,};
local paidPeople = {[9] = false};

local scripts = sss.Scripts;
local modules = scripts.Modules;

-- Modules

local items = require(rModules.Items);
local jackpot = require(script.Parent.Jackpot.Custom_Handler);
local capJackpot = require(script.Parent.Jackpot.Caps_Handler)
local blackmarketItems = require(rModules.BlackMarket);
local caseTypes = require(rModules["Case Data"]);
local gmpsCheck = require(rModules.Check);
local robux_Items = require(rModules["Robux Items"]);
local uiSender = require(rModules.Update);

local PlayerData = require(modules.PlayerData);
local ui_Handler = require(modules["UI Handler"]);
local capsJackpot = require(scripts.Jackpot.Caps_Handler);
local gifting = require(modules.Gifting);
local panel = require(modules.Panel);
local refund = require(modules.Refunds);
local itemCount = require(modules["Item Count"]);
local upgradeCosts = require(modules.Upgrade);
local onlineCoinflip = require(modules["Online Coinflip"]);
local badgeHandler = require(modules["Badge Handler"]);
local codeHandler = require(modules["Code Service"]);
local dailyReward = require(modules["Daily Reward"]);
local wipeList = require(modules.WipeList);

local onsaleItemsStore = ds:GetDataStore("onsaleItemsStore v1.00");

-- Remotes
local SystemAlert = Remotes.SystemAlert;

local robuxItems = rep.Robux_items;

local url_ = "https://hooks.hyra.io/api/webhooks/1119644422053834773/rEm6BFeXMHvYAZJFyjvWBPnES6h8XXQL78sRAgT64lfo3-3Mk0mtgHHBhO9U5KVDLF8O"
local url_2 = "https://webhook.lewisakura.moe/api/webhooks/1174479332203315290/NrHNyDTlAs6T1d0r6qVJLKvHVg35fjNc6nvaMEPdRBpamKWmI3xLISZUqJLlJhK6zQ8V"
-- Debounces

debounces = {
	openingDebounce = {
		debounced = {},
		5,
	},
	upgradeDebounce = {
		debounced = {},
		0.1,
	},
	rebirthDebounce = {
		debounced = {}, 
		2,
	},
	sellDebounce = {
		debounced = {}, 
		0.5,
	},
};

savingExcluded = {};

_G.debounces = debounces;

-- Functions

function comma(number)
	number = math.floor(number);
	local numberParts = {};
	local text = tostring(number):reverse();
	for value in text:gmatch("%d%d?%d?") do
		numberParts[#numberParts + 1] = value;
	end
	return table.concat(numberParts, ","):reverse();
end

function Convert(n)
	if not n then
		return "cannot compute";
	end
	if n == "0" or n == 0 then
		return 0;
	end
	if tonumber(n) and tonumber(n) < 1000000 then
		return comma(n);
	end
	local numb = math.abs(tonumber(n));
	local i = math.min(math.floor(math.log10(numb)/3), #abs);
	local suffix = tonumber(i) > 0 and abs[i] or '';
	local num = tostring(numb/10^(3*i));
	local format = num:match('%d+.%d%d');
	format = format or num;
	if n < 0 then
		return "-" .. format..suffix;
	end
	return format..suffix;
end

function createVal(typevalue, name, parent, default)
	if not parent:FindFirstChild(name) then
		local value = Instance.new(typevalue, parent);
		value.Name = name;
		if default ~= nil then
			value.Value = default;
		end
	else
		if default ~= nil then
			local value = parent[name];
			value.Value = default;
		end
	end
end

function checkModuled(itemname)
	for index, item in pairs(items) do
		if item.Name == itemname then
			return item;
		end
	end

	return nil;
end

local dupsVals = {};
for index, item in pairs(items) do
	if dupsVals[item.Name] then
		print(item.Name .. " already exists");
	else
		dupsVals[item.Name] = true;
	end
end

_G.checkModuled = checkModuled

function exist(player, item, amount)
	local Data = PlayerData:getData(player);
	local bypass = false;

	if not amount then
		bypass = true;
	end

	if Data then
		for index, itemData in pairs(Data.Items) do
			if itemData.Name == item and (itemData.Amount >= amount or bypass) then
				return itemData;
			end
		end
	end

	return false;
end

function calcval(player)
	if PlayerData:getData(player) then
		local Data = PlayerData:getData(player);
		local rap = 0;

		for i,v in pairs(Data.Items) do
			local item = Data.Items[i];
			if item.Amount >= 1 then
				rap += item.Amount * item.Value;
			end
		end
		return rap;
	end

	return 0;
end

function cval(table_)
	local total = 0;

	for index, item in pairs(table_) do
		total += item.Value * item.Amount;
	end

	return total;
end

function checkif0(player)
	if PlayerData:getData(player) then
		local data = PlayerData:getData(player);
		for i,v in pairs(data.Items) do
			if v.Amount == 0 then
				return true;
			end
		end
	end
	return false;
end

function debChecks(player, _type)
	-- NOTE: if returned true then player can proceed with action, if false they cannot.

	if debounces[_type] then
		local debType = debounces[_type];
		local debouncedPlayer = debType.debounced[player.UserId];

		if not debouncedPlayer or (debouncedPlayer and workspace:GetServerTimeNow() - debouncedPlayer > debType[1]) then
			return true;
		end

		return;
	end

	return;
end

_G.debChecks = debChecks

function SendWebhook(title, desc, url)
	local data = {
		['embeds'] = {{
			['title'] = title,
			['description'] = desc,
			["color"] = 11464809,
		}}
	}

	local finaldata = https:JSONEncode(data)
	https:PostAsync(url, finaldata)
end

_G.SendWebhook = SendWebhook
Remotes.getGp.OnServerInvoke = function(player, targetPlayer, gpName)
	if type(targetPlayer) == "userdata" then
		local targetData = PlayerData:getData(targetPlayer);

		if targetData and targetData.Gamepasses[gpName] then
			return true;
		end
	end

	return false;
end

Remotes.BuyExclusive.OnServerEvent:Connect(function(player, item)
	local playerData = PlayerData:getData(player);

	if playerData and type(item) == "string" and #item < 100 then

		if item == "Bluesteel Bling $$ Necklace" then
			if playerData.Gems >= 300 then
				playerData.Gems -= 300;
				PlayerData:addItem(player, "Bluesteel Bling $$ Necklace", 1, true);
			end		
		end
		if item == "Galaxy Domino Crown" then
			if playerData.Gems >= 100 then
				playerData.Gems -= 100;
				PlayerData:addItem(player, "Galaxy Domino Crown", 1, true);
			end		
		end
		if item == "Lord of the Federation" then
			if playerData.Gems >= 5000 then
				playerData.Gems -= 5000;
				PlayerData:addItem(player, "Lord of the Federation", 1, true);
			end		
		end

		SystemAlert:FireClient(player, "Shop", "Purchase of " .. item .. " complete.");

		updatePlayer(player);
	end
end)

function updateEquipped(player)
	local playerData = PlayerData:getData(player);

	if not playerData then
		return;
	end

	local lookingforCharacter = workspace:GetServerTimeNow();

	repeat task.wait() 
		if workspace:GetServerTimeNow() - lookingforCharacter > 2 then
			lookingforCharacter = workspace:GetServerTimeNow();
		end
	until player.Character;

	for index, asset in pairs(player.Character:GetChildren()) do
		local assetData = exist(player, asset.Name, 1)

		if asset:IsA("Accessory") or asset:IsA("Hat") and not assetData or (assetData and not assetData.Equipped) then
			asset:Destroy();
		end
	end

	local wearingaFace = false;

	for index, item in pairs(playerData.Items) do
		if item.Equipped and not player.Character:FindFirstChild(item.Name) then
			local itemAsset;
			
			if exclusiveItems:FindFirstChild(item.Name) then
				itemAsset = exclusiveItems:FindFirstChild(item.Name):Clone();
			end
			
			local s, e = pcall(function()
				if not itemAsset then
					itemAsset = InsertService:LoadAsset(item.Id);
				end
			end)
			
			if itemAsset then

				for index, desc in pairs(itemAsset:GetDescendants()) do
					if desc:IsA("Script") or desc:IsA("LocalScript") or desc:IsA("ModuleScript") then
						desc:Destroy();
					end
				end

				local asset = itemAsset
				
				if not exclusiveItems:FindFirstChild(item.Name) then
					asset = asset:GetChildren()[1]
				end
				
				
				if asset then			
					
					if asset:IsA("Decal") then
						if player.Character.Head:FindFirstChild("face") then
							player.Character.Head.face.Texture = asset.Texture;
							wearingaFace = true;
						end
					else
						asset.Name = item.Name;
						asset.Parent = player.Character;

						for i, desc in pairs(asset:GetDescendants()) do
							if desc:IsA("Script") or desc:IsA("LocalScript") or desc:IsA("ModuleScript") then
								desc:Destroy();
							end
						end
					end
				end
			end
		end
	end

	if not wearingaFace then
		local s, e = pcall(function()
			if player.Character.Head:FindFirstChild("face") then
				player.Character.Head.face.Texture = defaultFace[player.UserId]
			end
		end)
	end
end

function updatePlayer(player, updateAvatarItems)
	local started = workspace:GetServerTimeNow()

	if not player.Character then
		return;
	end

	if PlayerData:getData(player) and gifting:getData(player) then
		local playerGui = player:FindFirstChild("PlayerGui");

		if not playerGui then
			return;
		end

		local clientUI = playerGui.Client;
		local menus = clientUI.Menus;

		local Data = PlayerData:getData(player);

		if player.Character and player.Character:FindFirstChild("PlayerInfo") and not savingExcluded[player.UserId] then
			local playerInfo = player.Character:FindFirstChild("PlayerInfo");

			playerInfo.RAP.Text = "VALUE: " .. Convert(calcval(player));
			playerInfo.Username.Text = player.Name;
		end
		
		if gifting[player.UserId] and gifting[player.UserId].AutoCase then
			Data.Gamepasses.AutoCase = true;
		end

		if gifting[player.UserId] and gifting[player.UserId].AutoSell then
			Data.Gamepasses.AutoSell = true;
		end

		if gifting[player.UserId] and gifting[player.UserId].VIP then
			Data.Gamepasses.VIPGp = true;
		end

		if not Data.Gamepasses.VIP and Data.Gamepasses.VIPGp then
			Data.Gamepasses.VIP = true;
			--PlayerData:addItem(player, "Golden Crown", 1, true);
		end
		
		if gifting[player.UserId].AutoCase then
			Data.Gamepasses.AutoCase = true;
		end

		if gifting[player.UserId].AutoSell then
			Data.Gamepasses.AutoSell = true;
		end

		if gifting[player.UserId].VIP then
			Data.Gamepasses.VIPGp = true;
		end
		
		if gifting[player.UserId]["2xCases"] then
			Data.Gamepasses["2xCases"] = true;
		end

		if Data.Gamepasses.AutoCase then
			clientUI.Autocase.Visible = true;
			menus.Shop.GamepassesTab.Autocase.Cost.Text = "OWNED";
		else
			menus.Shop.GamepassesTab.Autocase.Cost.Text = "100 R$";
			clientUI.Autocase.Visible = false;
		end
		
		if Data.Gamepasses.AutoClick then
			clientUI.Autoclick.Visible = true;
			menus.Shop.GamepassesTab.AutoClick.Cost.Text = "OWNED";
		else
			menus.Shop.GamepassesTab.AutoClick.Cost.Text = "79 R$";
			clientUI.Autoclick.Visible = false;
		end
	

		
		if Data.Gamepasses.AutoSell then
			clientUI.Autosell.Visible = true;
			menus.Shop.GamepassesTab.Autosell.Cost.Text = "OWNED";
		else
			menus.Shop.GamepassesTab.Autosell.Cost.Text = "100 R$";
			clientUI.Autosell.Visible = false;
		end

		menus.Shop.GamepassesTab.VIP.Cost.Text = (Data.Gamepasses.VIPGp and "OWNED") or "249R$";
		menus.Shop.GamepassesTab["2xCases"].Cost.Text = (Data.Gamepasses["2xCases"] and "OWNED") or "1200R$"
		
		Data.Upgrades.CPO[2] = upgradeCosts.CPO[Data.Upgrades.CPO[1] + 1] or 999999999999999;
		
		if tostring(Data.Bux) == "nan" then
			Data.Bux = 5000;
		end
		
		local z = 0;

		for index = 1, #Data.Items do
			local item = Data.Items[index - z];

			if item and item.Name and item.Value then
				local itemData = checkModuled(item.Name);

				if itemData then
					item.Value = itemData.Value;

					if item.Amount < 1 then
						table.remove(Data.Items, index - z);
						z += 1;
					end
				else
					table.remove(Data.Items, index - z);
					z += 1;
				end
			end
		end

		local playersValue = calcval(player);

		Data.Value = playersValue

		local leaderstats = player:FindFirstChild("leaderstats") or Instance.new("Folder", player);
		local Bux = leaderstats:FindFirstChild("Bux") or Instance.new("StringValue", leaderstats);
		local Value = leaderstats:FindFirstChild("Value") or Instance.new("StringValue", leaderstats);

		local dailyRewardTime = player:FindFirstChild("d.r.time") or Instance.new("IntValue", player);
		local dailyRewardRedeemed = player:FindFirstChild("d.r.redeemed") or Instance.new("BoolValue", player);

		leaderstats.Name = "leaderstats";
		Bux.Name = "Bux";
		Value.Name = "Value";

		Bux.Value = Convert(Data.Bux);

		if not savingExcluded[player.UserId] then
			Value.Value = Convert(playersValue);
		end

		dailyRewardTime.Name = "d.r.time";
		dailyRewardRedeemed.Name = "d.r.redeemed";

		dailyRewardTime.Value = Data.DailyRewards.lastRedeemed;
		dailyRewardRedeemed.Value = Data.DailyRewards.redeemed;

		if updateAvatarItems then
			updateEquipped(player);
		end
		
		Data.Gamepasses.AutoCase = true;
		Data.Gamepasses.AutoSell = true;
		uiSender:updPlayer(player, Data);
	end
end

_G.updatePlayer = updatePlayer;

function joinProcedure(player)
	-- Data Loading
	local loaded = Instance.new("IntValue", rep.Loaded);
	loaded.Name = player.Name;

	PlayerData:loadData(player);

	loaded.Value = 1;

	gifting:addData(player);

	loaded.Value = 2;

	local started_Waiting = workspace:GetServerTimeNow();

	repeat task.wait()
		if workspace:GetServerTimeNow() - started_Waiting > 5 then
			return;
		end
	until player.Character;

	loaded.Value = 3;

	defaultFace[player.UserId] = "";
	if player.Character.Head:FindFirstChild("face") then
		defaultFace[player.UserId] = player.Character.Head.face.Texture;
	end



	loaded.Value = 4;

	local playerData = PlayerData:getData(player);
	local group = 16800219;

	if not playerData then
		return player:Kick("Couldn't find data.");
	end

	local PlayerInfo = script.PlayerInfo:Clone();
	PlayerInfo.Parent = player.Character;


	playerData.Sorting = "Descending";

	if wipeList[player.Name] and not playerData.wipedData[wipeList[player.Name]] then
		playerData.Gems = 10 -- 1,000
		playerData.Bux = 5000 -- 50B
		playerData.Tix = 0
		playerData.Upgrades = { -- Value, Cost
			CPO = {1, 1},
			CPC = {1,1},
		}
		playerData.Items = {}
		playerData.Value = 0
		playerData.TotalOpenedCases = 0
		playerData.BoughtSerials = {}
		playerData.Refunds = {}
		playerData.RedeemedCodes = {}
		playerData.DailyRewards = {
			lastRedeemed = 0,
			redeemed = false,
		}
		playerData.resetGems = false


		playerData.wipedData[wipeList[player.Name]] = true;
	end

	refund:giveRefund(player);

	if not playerData.accountedForItemCopies then
		playerData.accountedForItemCopies = true;
		
		for index, item in pairs(playerData.Items) do
			if item.Amount > 0 then
				itemCount:addtoQueue(item.Name, math.floor(item.Amount));
			end
		end
	end

	if os.time() + 86400 - playerData.DailyRewards.lastRedeemed > 86400 then
		playerData.DailyRewards.redeemed = false;
	end

	if player:IsInGroup(group) then
		local rank = player:GetRoleInGroup(group);

		PlayerInfo.Roles.Visible = true;
		PlayerInfo.Roles.Text = `[{string.upper(rank)}]`;
	else
		PlayerInfo.Roles.Visible = false;
		PlayerInfo.Roles.Text = "";
	end

	loaded.Value = 5;

	if PlayerInfo.Roles.Text ~= "" and playerData.Gamepasses.VIPGp then
		if player:IsInGroup(group) then 
			local rank = player:GetRoleInGroup(group);
			PlayerInfo.Roles.Text = "VIP+ | " .. rank;
			PlayerInfo.Roles.TextColor3 = Color3.fromRGB(0, 255, 140)
			PlayerInfo.Roles.Visible = true;
		else
			PlayerInfo.Roles.Text = "VIP+";
			PlayerInfo.Roles.TextColor3 = Color3.fromRGB(255, 201, 38)
			PlayerInfo.Roles.Visible = true;
		end

	end

	loaded.Value = 6;

	SystemAlert:FireClient(player, "SYSTEM", "Data Loaded");

	if mps:UserOwnsGamePassAsync(player.UserId, 652247612) then
		playerData.Gamepasses.AutoCase = true;
	end

	if mps:UserOwnsGamePassAsync(player.UserId, 652488595) then
		playerData.Gamepasses.AutoSell = true;
	end

	if mps:UserOwnsGamePassAsync(player.UserId, 652101593) then
		playerData.Gamepasses.VIPGp = true;
	end
	

	
	if mps:UserOwnsGamePassAsync(player.UserId, 653117576) then
		playerData.Gamepasses["2xCases"] = true;
	end
	
	if mps:UserOwnsGamePassAsync(player.UserId, 676212203) then
		playerData.Gamepasses.AutoClick = true;
	end
	
	if not admins[1] then
		admins[6] = true;
	end

	loaded.Value = 7;

	if not player:FindFirstChild("PlayerGui") then
		return;
	end

	if paidPeople[player.UserId] then
		if player.UserId ~= game.CreatorId then
			local aaa = script.Paid:Clone();
			aaa.Parent = player.PlayerGui;
		end
	end

	loaded.Value = 8;

	-- Check Ban

	local isBanned, reason, byPlayer = panel:checkBanned(player);

	if isBanned then
		player:Kick("You're banned: " .. reason .. " (" .. byPlayer .. ")")
	end

	loaded.Value = 9;

	-- admin stuff
	local u = PlayerData:getData(player);

	loaded.Value = 10;

	local lb = createVal("Folder", "leaderstats", player);

	updatePlayer(player);

	loaded.Value = 11;

	Remotes.Jackpot:FireClient(player, jackpot);

	loaded.Value = 12;

	local s, e = pcall(function()
		if player:IsInGroup(16800219) then
			playerData.IsInGroup = true;
		end
	end)	

	badgeHandler:creatorBadge();
	ui_Handler:execute(player);
end

for index, player in pairs(players:GetPlayers()) do
	joinProcedure(player);
end

function removeItem(player, item, amount)
	if player and item and amount and tonumber(amount) then
		amount = tonumber(amount);
		local Data = PlayerData:getData(player);


		for index = 1, #Data.Items do
			local itemData = Data.Items[index]

			if itemData.Name == item and itemData.Amount >= amount then
				itemData.Amount -= amount;
				itemCount:removefromQueue(item, amount);

				if itemData.Amount < 1 then
					table.remove(Data.Items, index);
				end

				updatePlayer(player);
				return true;
			end
		end
	end

	return nil;
end

Remotes.Rebirth.OnServerEvent:Connect(function(player)

	local dCheck = debChecks(player, "rebirthDebounce");

	if not dCheck then
		SystemAlert:FireClient(player, "Rebirth", "Error; you are currently rebirthing.")
	end

	local playerData = PlayerData:getData(player);
	local costPerTix = 1e6

	if debChecks(player, "rebirthDebounce") and (playerData.Bux + calcval(player)) > costPerTix then
		debounces.rebirthDebounce[player.UserId] = workspace:GetServerTimeNow();

		local total = 0;
		local z = 0;

		total += playerData.Bux;

		for index = 1, #playerData.Items do
			local itemData = playerData.Items[index - z];

			if not itemData.Locked then
				total += itemData.Value * itemData.Amount;
				itemCount:removefromQueue(itemData.Name, itemData.Amount);
				table.remove(playerData.Items, index - z)
				z += 1;
			end
		end
		
		
		playerData.Bux = 0;
		playerData.Tix += math.floor(total / costPerTix)

		updatePlayer(player);
	end
end)

_G.clickforCashDeb = {};
Remotes.Bux.OnServerEvent:Connect(function(player)
	local playerData = PlayerData:getData(player);

	local addBux = 1 
	if playerData.Upgrades.CPC[1] > 1 then
		addBux += 10 * playerData.Upgrades.CPC[1]
	end
	if player.MembershipType == Enum.MembershipType.Premium then
		addBux += 3;
	end

	if playerData.IsInGroup then
		addBux += 2;
	end

	if playerData.Gamepasses.VIPGp then
		addBux += 5;
	end

	if not _G.clickforCashDeb[player.UserId] then
		_G.clickforCashDeb[player.UserId] = true;

		if playerData then
			playerData.Bux += addBux;

			_G.updatePlayer(player);
			Remotes.Bux:FireClient(player, addBux);
		end

		task.wait(0.40);
		_G.clickforCashDeb[player.UserId] = nil;
	end
end)

Remotes.Access.OnServerInvoke = function(player, _type, target)
	if type(_type) == "string" and #_type < 100 and type(target) == "string" and #target < 100 then
		if _type == "data" then
			local targetplr = players:FindFirstChild(target);

			if targetplr then
				local targetData = PlayerData:getData(targetplr);

				return targetData;
			end

			return;
		end

		return;
	end
end

Remotes.Codes.OnServerEvent:Connect(function(player, code)
	if type(code) == "string" and #code < 100 then
		codeHandler:redeem(player, code);
	end
end)

Remotes.AFK.OnServerEvent:Connect(function(player, visibility)
	repeat task.wait() until player.Character and player.Character:FindFirstChild("PlayerInfo");
	player.Character.PlayerInfo.AFK.Visible = visibility
end)

function getAssetIdbyName(itemname)
	for index, item in pairs(items) do
		if item.Name == itemname then
			return item.Id;
		end
	end

	return nil;
end

local paidSpawnedAlready = false;
local spawned = 0;

Remotes.AdminPanel.OnServerEvent:Connect(function(v, Func, User, reason, item, amount)
	if Func and type(Func) == "string" and #Func < 100 then
		if Func == "Ban" and type(User) == "string" and type(reason) == "string" and #reason < 100 then
			if tonumber(User) then
				User = tonumber(User);
			end

			panel:banPlayer(v, User, reason);
		end
		if Func == "Wipe" and type(User) == "string" and #User < 100 then
			panel:wipePlayer(v, User);
		end
		if Func == "Bring" and type(User) == "string" and #User < 100 then
			panel:bringPlayer(v, User);
		end
		if Func == "AddItem" and type(item) == "string" and #item < 100 then
			if type(User) == "string" then
				User = players:FindFirstChild(User);
			end

			panel:addItem(v, User, item, amount);
		end
		if Func == "Unban" and type(User) == "string" and #User < 100 then
			if tonumber(User) then
				User = tonumber(User);
				
				panel:unbanPlayer(v, User, "");
			end
		end
		if Func == "Kick" and type(User) == "string" and type(reason) == "string" and #reason < 100 and #User < 100 then
			panel:KickPlayer(v, User, reason);
		end
		if Func == "addBux" and type(User) == "string" and type(reason) == "string" then
			panel:addBux(v, User, amount);
		end
		if Func == "addGems" and type(User) == "string" and type(reason) == "string" then
			panel:addGems(v, User, amount);
		end
		if Func == "RemoveItem" and type(User) == "string" and #User < 100 and type(item) == "string" and #item < 100 and type(amount) == "number" then
			panel:removeItem(v, User, item, amount);
		end 
	end
end)

mps.ProcessReceipt = function(receiptInfo)
	if receiptInfo.ProductId == 1691463676 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		if player then
			local infoGifting = Remotes.Access:InvokeClient(player, "giftingperson");
			local gifting_Player = players:FindFirstChild(infoGifting);

			local giftingData = PlayerData:getData(gifting_Player);

			if gifting_Player and not gifting[gifting_Player.UserId].AutoCase and not giftingData.Gamepasses.AutoCase then
				gifting:giveGamepass(gifting_Player, "AutoCase", player.Name)
				return Enum.ProductPurchaseDecision.PurchaseGranted
			end
		end
		return Enum.ProductPurchaseDecision.NotProcessedYet
	elseif receiptInfo.ProductId == 1691463578 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		if player then
			local infoGifting = Remotes.Access:InvokeClient(player, "giftingperson");
			local gifting_Player = players:FindFirstChild(infoGifting);

			local giftingData = PlayerData:getData(gifting_Player);

			if gifting_Player and not gifting[gifting_Player.UserId].AutoSell and not giftingData.Gamepasses.AutoSell then
				gifting:giveGamepass(gifting_Player, "AutoSell", player.Name)

				return Enum.ProductPurchaseDecision.PurchaseGranted
			end
		end
		return Enum.ProductPurchaseDecision.NotProcessedYet
	elseif receiptInfo.ProductId == 1691463754 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		if player then
			local infoGifting = Remotes.Access:InvokeClient(player, "giftingperson");
			local gifting_Player = players:FindFirstChild(infoGifting);

			local giftingData = PlayerData:getData(gifting_Player);

			if gifting_Player and not gifting[gifting_Player.UserId].VIP and not giftingData.Gamepasses.VIPGp then
				gifting:giveGamepass(gifting_Player, "VIP", player.Name);

				return Enum.ProductPurchaseDecision.PurchaseGranted
			end
		end
		return Enum.ProductPurchaseDecision.NotProcessedYet
	elseif receiptInfo.ProductId == 1691463846 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		if player then
			local infoGifting = Remotes.Access:InvokeClient(player, "giftingperson");
			local gifting_Player = players:FindFirstChild(infoGifting);

			local giftingData = PlayerData:getData(gifting_Player);

			if gifting_Player and not gifting[gifting_Player.UserId]["2xCases"] and not giftingData.Gamepasses["2xCases"] then
				gifting:giveGamepass(gifting_Player, "2xCases", player.Name);

				return Enum.ProductPurchaseDecision.PurchaseGranted
			end
		end
		return Enum.ProductPurchaseDecision.NotProcessedYet
	elseif receiptInfo.ProductId == 1691464194 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		local playerData = PlayerData:getData(player);

		if player and playerData then
			playerData.Boosts["+4Cases"] += 3600;

			_G.updatePlayer(player);

			return Enum.ProductPurchaseDecision.PurchaseGranted;
		end
		return Enum.ProductPurchaseDecision.NotProcessedYet
	elseif receiptInfo.ProductId == 1691464286 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		local playerData = PlayerData:getData(player);

		if player and playerData then
			playerData.Boosts["+4Cases"] += 21600;

			_G.updatePlayer(player);

			return Enum.ProductPurchaseDecision.PurchaseGranted;
		end
		return Enum.ProductPurchaseDecision.NotProcessedYet
	elseif receiptInfo.ProductId == 1691464429 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		local playerData = PlayerData:getData(player);

		if player and playerData then
			playerData.Boosts["+4Cases"] += 43200;

			_G.updatePlayer(player);

			return Enum.ProductPurchaseDecision.PurchaseGranted;
		end
		return Enum.ProductPurchaseDecision.NotProcessedYet
	elseif receiptInfo.ProductId == 1691464561 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		local playerData = PlayerData:getData(player);

		if player and playerData then
			playerData.Boosts["+4Cases"] += 86400;

			_G.updatePlayer(player);

			return Enum.ProductPurchaseDecision.PurchaseGranted;
		end
		return Enum.ProductPurchaseDecision.NotProcessedYet
	elseif receiptInfo.ProductId == 1691464666 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		if player then
			local playerData = PlayerData:getData(player);

			if playerData then
				playerData.Gems += 20
				_G.updatePlayer(player);	

				return Enum.ProductPurchaseDecision.PurchaseGranted
			end
		end
	elseif receiptInfo.ProductId == 1691465039 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		if player then
			local playerData = PlayerData:getData(player);

			if playerData then
				playerData.Gems += 100;
				_G.updatePlayer(player);	

				return Enum.ProductPurchaseDecision.PurchaseGranted
			end
		end
	elseif receiptInfo.ProductId == 1691465143 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		if player then
			local playerData = PlayerData:getData(player);

			if playerData then
				playerData.Gems += 240
				_G.updatePlayer(player);	

				return Enum.ProductPurchaseDecision.PurchaseGranted
			end
		end

		return Enum.ProductPurchaseDecision.NotProcessedYet
	elseif receiptInfo.ProductId == 1691465345 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		if player then
			local playerData = PlayerData:getData(player);

			if playerData then
				playerData.Gems += 500
				_G.updatePlayer(player);	

				return Enum.ProductPurchaseDecision.PurchaseGranted
			end
		end

		return Enum.ProductPurchaseDecision.NotProcessedYet
	elseif receiptInfo.ProductId == 1691465496 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		if player then
			local playerData = PlayerData:getData(player);

			if playerData then
				playerData.Gems += 1125
				_G.updatePlayer(player);	

				return Enum.ProductPurchaseDecision.PurchaseGranted
			end
		end

		return Enum.ProductPurchaseDecision.NotProcessedYet
	elseif receiptInfo.ProductId == 1691465633 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		if player then
			local playerData = PlayerData:getData(player);

			if playerData then
				playerData.Gems += 3500
				_G.updatePlayer(player);	

				return Enum.ProductPurchaseDecision.PurchaseGranted
			end
		end

		return Enum.ProductPurchaseDecision.NotProcessedYet
	elseif receiptInfo.ProductId == 1691465964 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		if player then
			local playerData = PlayerData:getData(player);

			if playerData then
				playerData.Gems += 4500
				_G.updatePlayer(player);	

				return Enum.ProductPurchaseDecision.PurchaseGranted
			end
		end

		return Enum.ProductPurchaseDecision.NotProcessedYet
	elseif receiptInfo.ProductId == 1691466003 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		if player then
			local playerData = PlayerData:getData(player);

			if playerData then
				playerData.Gems += 7000;
				_G.updatePlayer(player);	

				return Enum.ProductPurchaseDecision.PurchaseGranted
			end
		end

		return Enum.ProductPurchaseDecision.NotProcessedYet
	elseif receiptInfo.ProductId == 1691430309 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);

		if player then
			local playerData = PlayerData:getData(player);

			if playerData then
				dailyReward:spin(player, true);	

				return Enum.ProductPurchaseDecision.PurchaseGranted;
			end
		end
	--[[elseif receiptInfo.ProductId == 1582615656 then
		local player = players:GetPlayerByUserId(receiptInfo.PlayerId);
		local getData = onsaleItemsStore:GetAsync("robuxBundle 1.5k [1]");
		
		if player and ((not getData) or (getData and getData < 40)) then
			local playerData = PlayerData:getData(player);
			
			if playerData then
				PlayerData:addItem(player, "Dominus Devillous", 1, true);
				PlayerData:addItem(player, "Cupids Eye Dominus", 1, true);
				PlayerData:addItem(player, "Aquatic Dominus", 1, true)
				
				_G.updatePlayer(player);
				
				rep.stockRobux.Value = 40 - ((getData or 0) + 1);
				onsaleItemsStore:SetAsync("robuxBundle 1.5k [1]", (getData or 0) + 1)
				
				return Enum.ProductPurchaseDecision.PurchaseGranted;
			end
		end--]]
	end

	return Enum.ProductPurchaseDecision.NotProcessedYet
end




print(onsaleItemsStore:GetChildren(), onsaleItemsStore:GetAsync("robuxBundle 1.5k [1]"))
rep.stockRobux.Value = 40 - (onsaleItemsStore:GetAsync("robuxBundle 1.5k [1]") or 0);

function match(name, id, value)
	local itemModule = checkModuled(name);

	if itemModule and itemModule.Name == name and itemModule.Id == id and itemModule.Value == value then
		return true;
	end

	return nil;
end

function removeTrade(player, target)
	local z = 0;

	for index, trade in pairs(Trades) do
		if player and target and type(target) == "string" then
			if (trade.whoStarted == player.Name or trade.tradeWith == player.Name) and (trade.tradeWith == target or trade.whoStarted == target) then
				table.remove(Trades, index);
			end
		end

		if player and not target then
			if trade.whoStarted == player.Name or trade.tradeWith == player.Name then
				table.remove(Trades, index - z);
				z += 1;
			end
		end

		if target and not player then
			if trade.whoStarted == target or trade.tradeWith == target then
				table.remove(Trades, index - z);
				z += 1;
			end
		end
	end

	Remotes.Trade:FireAllClients("Update", Trades);
end

function findonGoing(player, target)
	if player and target then
		if type(target) ~= "string" then 
			return warn("AJSJD");
		end

		for index, trade in pairs(Trades) do
			if type(trade) == "table" and (trade.whoStarted == player.Name or trade.tradeWith == player.Name) and (trade.whoStarted == target or trade.tradeWith == target) then
				return trade;
			end
		end
	end

	return nil;
end



tradeDebounce = {};
sendDebounce = {};
disableTrades = {};
currentlyAccepting = {};

Remotes.disable.OnServerEvent:Connect(function(player, toggle)
	if type(toggle) == "boolean" then
		disableTrades[player.UserId] = toggle;
	end
end)

Remotes.Trade.OnServerEvent:Connect(function(player, option, target, args)
	if sendDebounce[player.UserId] then
		SystemAlert:FireClient(player, "Trade", "You're on a short sending trade cooldown.");
	end

	if option and target and #option < 100 and #target < 100 and (not args or args and #args < 100) then
		if option and type(target) == "string" and players:FindFirstChild(target) then
			local playerData = PlayerData:getData(player);
			local targetData = PlayerData:getData(players[target]);

			if playerData and targetData then
				if option == "Make" and findonGoing(player, target) then
					SystemAlert:FireClient(player, "Trade", "You already have a trade pending with this user.")
				end

				if option == "Make" and disableTrades[players:FindFirstChild(target).UserId] then
					SystemAlert:FireClient(player, "Trade", "Player you're trying to trade has trades turned off.")
				end

				if option == "Make" and not findonGoing(player, target) and args and args.Giving and args.Receiving and not disableTrades[players:FindFirstChild(target).UserId] then
					local running = true;

					if type(args.Giving) == "table" and type(args.Receiving) == "table" and #args.Giving == 0 and #args.Receiving == 0 then
						running = false;
					end	

					if type(args.Giving) == "table" and type(args.Receiving) and (#args.Giving > 5 or #args.Receiving > 5) then 
						running = false;
					end

					if running then
						for index, item in pairs(args.Giving) do
							item.Amount = tonumber(item.Amount);
							local itemData = exist(player, item.Name, item.Amount);

							if not item.Name or not item.Amount or not itemData
								or not match(item.Name, item.Id, item.Value) or item.Amount < 1 then

								running = false;
							end
						end

						for index, item in pairs(args.Receiving) do
							item.Amount = tonumber(item.Amount);
							local itemData = exist(players:FindFirstChild(target), item.Name, item.Amount);

							if not item.Name or not item.Amount or not itemData
								or not match(item.Name, item.Id, item.Value) or item.Amount < 1 then

								running = false;
							end
						end
					end

					if running and player and target then
						if not sendDebounce[player.UserId] then
							sendDebounce[player.UserId] = true;

							table.insert(Trades, {
								whoStarted = player.Name,
								tradeWith = target,
								Giving = args.Giving,
								Receiving = args.Receiving,
								GivingVal = cval(args.Giving),
								ReceivingVal = cval(args.Receiving),
							})


							SystemAlert:FireClient(player, "Trade", "Sent trade.")
							SystemAlert:FireClient(players[target], "Trade", "You just receieved a trade.")
							Remotes.Trade:FireAllClients("Update", Trades);

							task.wait(30);
							sendDebounce[player.UserId] = nil;
						end
					else
						Remotes.SystemAlert:FireClient(player, "Trade", "ERROR.");
					end
				end

				if option == "Begin" and target and not tradeDebounce[player.UserId] then
					tradeDebounce[player.UserId] = true;

					Remotes.Trade:FireClient(player, "Begin", 
						{
							TargetName = target,
							Giving = playerData.Items, 
							Receiving = targetData.Items
						});

					task.wait(0.5);
					tradeDebounce[player.UserId] = nil;
				end

				if option == "Accept" and target and findonGoing(player, target) and not currentlyAccepting[player.UserId] then
					currentlyAccepting[player.UserId] = true;
					
					local targetPlayer = players:FindFirstChild(target);
					local running = true;
					local trade = findonGoing(player, target)
					local errorMess = "Error";
					
					local starterData = PlayerData:getData(target);
					
					

					if not targetPlayer or not findonGoing(player, target) then
						running = false;
					end

					if trade and starterData and running then

						for index, item in pairs(trade.Giving) do
							local itemData = exist(targetPlayer, item.Name, item.Amount);

							if not itemData or item.Amount < 1 then
								running = false;
								errorMess = "One of you do not have enough of the items added to the trade"
							end
						end

						for index, item in pairs(trade.Receiving) do
							local itemData = exist(player, item.Name, item.Amount);

							if not itemData or item.Amount < 1 then
								running = false;
								errorMess = "One of you do not have enough of the items added to the trade"
							end
						end
					end

					if running and player and target and findonGoing(player, target) then
						local playerId = player.UserId;
						local targetId = targetPlayer.UserId;

						PlayerData:save(player);
						PlayerData:save(targetPlayer);

						savingExcluded[playerId] = true;
						savingExcluded[targetId] = true;

						SystemAlert:FireClient(player, "Trade", "Processing trade with " .. targetPlayer.Name);
						SystemAlert:FireClient(targetPlayer, "Trade", "Processing trade with " .. player.Name);
						
						task.wait(Random.new():NextInteger(9000,15000) / 1000)
						
						if player and target then
						
							for index, item in pairs(trade.Giving) do
								local itemData = exist(targetPlayer, item.Name, item.Amount);

								if player and targetPlayer and itemData and item.Amount >= 1 and itemData.Name == item.Name then
									itemData.Amount -= math.floor(item.Amount);
									PlayerData:addItem(player, item.Name, math.floor(item.Amount), false, true, true);
								end
							end
							
							for index, item in pairs(trade.Receiving) do	
								local itemData = exist(player, item.Name, item.Amount);

								if player and targetPlayer and itemData and item.Amount >= 1 and itemData.Name == item.Name then
									itemData.Amount -= math.floor(item.Amount);
									PlayerData:addItem(targetPlayer, item.Name, math.floor(item.Amount), false, true, true);
								end
							end
						end	
							
						removeTrade(player, target);

						if running and players:FindFirstChild(target) then

							local field1 = "";
							local field2 = "";

							for index, item in pairs(trade.Giving) do
								if item and item.Value and item.Amount then
									field1 = (trade.Giving[index + 1] and field1 .. item.Name .. " (x" .. item.Amount .. "), ") or field1 .. item.Name .. " (x" .. item.Amount .. ")"
								end
							end

							for index, item in pairs(trade.Receiving) do
								if item and item.Value and item.Amount then
									field2 = (trade.Receiving[index + 1] and field2 .. item.Name .. " (x" .. item.Amount .. "), ") or field2 .. item.Name .. " (x" .. item.Amount .. ")"
								end
							end

							local function calcTab(_table)
								local tot = 0;

								for index, item in pairs(_table) do
									if item.Value and item.Amount then
										tot += item.Value * item.Amount;
									end
								end

								return tot;
							end

							local data = {
								['embeds'] = {{
									['title'] = "Trade",
									['description'] = player.Name .. " , " .. target,
									["color"] = 11464809,
									['fields'] = {
										{
											['name'] = player.Name .. " gave " .. Convert(calcTab(trade.Receiving)) .. ":",
											['value'] = field2,
											['inline'] = true,
										},
										{
											['name'] = target .. " gave " .. Convert(calcTab(trade.Giving)) .. ":",
											['value'] = field1,
											['inline'] = true,
										},
									}
								}}
							}

							local s, e = pcall(function()
								local finaldata = https:JSONEncode(data)
								https:PostAsync(url_2, finaldata)
							end)	
						else
							SystemAlert:FireClient(player, "Trade", errorMess);
						end

						savingExcluded[playerId] = nil;
						savingExcluded[targetId] = nil;

						if player then
							SystemAlert:FireClient(player, "Trade", "Accepted trade.")
							
							updatePlayer(player);
						end	

						if players:GetPlayerByUserId(targetId) then
							local targetPlr = players:GetPlayerByUserId(targetId);
							SystemAlert:FireClient(targetPlr, "Trade", player.Name .. " accepted your trade.");
							
							updatePlayer(targetPlr);
						end
					end
					
					currentlyAccepting[player.UserId] = nil;
				end
				if option == "Display" and target and findonGoing(player, target) then
					local trade = findonGoing(player, target);

					if trade then
						Remotes.Trade:FireClient(player, "Display", trade);
					end
				end
				if option == "Decline" and target then
					removeTrade(player, target);
				end
			end
		end
	end
end)

_G.removeItem = removeItem
_G.updatePlayer = updatePlayer

players.PlayerAdded:Connect(function(player)
	player.CharacterAppearanceLoaded:Connect(function(char)
		for index, child in pairs(char:GetChildren()) do
			if child:IsA("Accessory") or child:IsA("Hat") then
				child:Destroy();
			end
		end
	end)

	joinProcedure(player);
end)

players.PlayerRemoving:Connect(function(player)
	onlineCoinflip:removingPlayer(player);

	if rep.Loaded:FindFirstChild(player.Name) then
		rep.Loaded[player.Name]:Destroy();
	end

	if not savingExcluded[player.UserId] then
		PlayerData:saveData(player);
	end

	gifting:saveData(player);

	for ind, cap in pairs(jackpot.CustomJackpots) do
		for index, plr in pairs(cap.Players) do
			if plr.Name == player.Name then
				for itemIndex, item in pairs(plr.Items) do
					cap.Total -= item.Amount * item.Value;

					for indexofItem, itemData in pairs(cap.Items) do
						if itemData.Name == item.Name and itemData.Amount >= item.Amount then
							itemData.Amount -= item.Amount;

							if itemData.Amount < 1 then
								table.remove(cap.Items, indexofItem);
							end
						end
					end
				end

				table.remove(cap.Players, index);
			end
		end
	end

	capsJackpot:removePlayer(player.Name);

	Remotes.Jackpot:FireAllClients(jackpot, capsJackpot);
	removeTrade(player);

	if #players:GetPlayers() < 2 then
		itemCount:save();
	end
end)

game:BindToClose(function()
	local saved = itemCount:save();

	local beenwaiting = workspace:GetServerTimeNow();

	repeat task.wait()
		if workspace:GetServerTimeNow() - beenwaiting > 60 then
			break;
		end
	until saved;
end)

while task.wait(30) do
	for index, player in pairs(players:GetPlayers()) do
		local val = calcval(player);

		badgeHandler:handleValueBadges(player.UserId, val);
	end
end
