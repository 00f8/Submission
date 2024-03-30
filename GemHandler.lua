local sss = game:GetService("ServerScriptService")
local GemModule = require(game.ServerScriptService:WaitForChild("Modules"):WaitForChild("GemModule"))

local dataManager = require(game.ServerScriptService:WaitForChild("Modules"):WaitForChild("DataManager"))

local Click = game:WaitForChild("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("Click")


local players = game:GetService("Players")
local badge = game:GetService("BadgeService")
local AbyssbadgeID = 1322432922784660
local UraniumbadgeID = 3939754538936125
local TealbadgeID = 3085478391533576 -- badge givers

local CurrentGem = nil
local CGHP = 0

local tweenService = game:GetService("TweenService")

local RaritiesService = require(game.ServerScriptService:WaitForChild("Modules"):WaitForChild("RarityService"))
local Rarities = require(game.ServerScriptService:WaitForChild("Modules"):WaitForChild("Raritys"))

local abysstweeninfo = TweenInfo.new(
	30,
	Enum.EasingStyle.Sine,
	Enum.EasingDirection.In,
	0,
	false,
	0
)

local abyssProperties = {
	["Size"] = Vector3.new(49.675, 121.038, 54.587),
	["CFrame"] = CFrame.new(-3.75, 38.029, 4.75),
	["Color"] = Color3.fromRGB(0,0,0)
}

local TealTweenInfo = TweenInfo.new(
	5,
	Enum.EasingStyle.Sine,
	Enum.EasingDirection.In,
	0,
	false,
	0
)

local TealProperties = {
	["Size"] = Vector3.new(37.675, 49.038, 26.087),
	["CFrame"] = CFrame.new(-3, 21.529, 1.75),
}

local BlueTealTweenInfo = TweenInfo.new(
	0.1,
	Enum.EasingStyle.Sine,
	Enum.EasingDirection.InOut,
	0,
	false,
	50
)

local BlueTealProperties = {
	["CFrame"] = Vector3.new(0,360,0)
}

local GreenTweenInfo = TweenInfo.new(
	3,
	Enum.EasingStyle.Sine,
	Enum.EasingDirection.In,
	0,
	false,
	0
)

local GreenProperties = {
	["CFrame"] = CFrame.new(-3.25, 36.279, -2),

}

local BlastTweenInfo = TweenInfo.new(
	5,
	Enum.EasingStyle.Back,
	Enum.EasingDirection.In,
	0,
	false,
	0
)

local BlastProperties = {
	["Size"] = Vector3.new(72, 72, 72),
	["Color"] = Color3.fromRGB(0, 255, 0),
	["CFrame"] = CFrame.new(-2, 15.51, -0.5),

}

local BlastOutTweenInfo = TweenInfo.new(
	5,
	Enum.EasingStyle.Back,
	Enum.EasingDirection.Out,
	0,
	false,
	0
)

local BlastOutProperties = {
	["CFrame"] = CFrame.new(-2, 0.01, -0.5),
	["Size"] = Vector3.new(1, 1, 1)
}


function GenerateGem(Gem, admin)
	if admin then
		if Gem == "Abyss" then -- checking if the secret was spawned
			game.ReplicatedStorage.Remotes.Chat:FireAllClients("ADMIN","A SECRET ".. Gem .. " HAS BEEN SPAWNED IN BY A ADMIN!", "#000000")
		else
			game.ReplicatedStorage.Remotes.Chat:FireAllClients("ADMIN","OMG A ADMIN JUST SPAWNED IN A ".. Gem .. "!", "#320070")
		end
	end
	
	
	-- deletes old gems
	
	for i,v in pairs(game.Workspace:GetChildren()) do
		if v.Name == "Gem" then
			v:Destroy()
		end
	end
	
	
	
	
	-- If gem has a custom animation the it will play the gem that is pretty much it
	for i,v in pairs(GemModule) do
		if i == Gem then
			CurrentGem = i
			CGHP = v.Health
			local CGem = v.Model:Clone()
			CGem.Parent = workspace
			CGem.Name = "Gem"
			
			
			
			
			
			
			-- Extra Event Gibberish
			if i == "Abyss" then
				CGHP = math.huge
				wait(1)
				local abyssTween = tweenService:Create(CGem, abysstweeninfo, abyssProperties)
				
				abyssTween:Play()
				
				for i,v in pairs(game.Players:GetChildren()) do
					badge:AwardBadge(v.UserId,AbyssbadgeID)
				end
				game.Workspace:WaitForChild("Shake").Level.Value = 2
				game.SoundService.Abyss:Play()
				wait(30)
				CGHP = v.Health
			else
				game.Workspace:WaitForChild("Shake").Level.Value = 0
			end
			
			if i == "Uranium" then
				CGHP = math.huge
				for i,v in pairs(game.Players:GetChildren()) do
					badge:AwardBadge(v.UserId,UraniumbadgeID)
				end
				
				local Green = script.Green:Clone()
				Green.Parent = game.Workspace
				
				local Blast = script.Blast:Clone()
				Blast.Parent = game.Workspace
				
				local greentween = tweenService:Create(Green, GreenTweenInfo, GreenProperties)
				greentween:Play()
				wait(3)
				Green:Destroy()
				local blasttween = tweenService:Create(Blast, BlastTweenInfo,BlastProperties)
				blasttween:Play()
				Blast.Anchored = true
				game.Workspace:WaitForChild("Shake").Level.Value = 3
				game.SoundService.Fission:Play()
				wait(5)
				local blastouttween = tweenService:Create(Blast,BlastOutTweenInfo,BlastOutProperties)
				blastouttween:Play()
				CGem.Color = Color3.fromRGB(0,255,0)
				CGem:WaitForChild("PointLight").Color = Color3.fromRGB(0,255,0)
				wait(5)
				Blast:Destroy()
				CGHP = v.Health
				game.Workspace:WaitForChild("Shake").Level.Value = 0 
			end
			
			if i == "Teal" then
				CGHP = math.huge
				for i,v in pairs(game.Players:GetChildren()) do
					badge:AwardBadge(v.UserId,TealbadgeID)
				end
				
				local tealtween = tweenService:Create(CGem,TealTweenInfo,TealProperties)
				tealtween:Play()
				wait(5)
				CGHP = v.Health
				game.Workspace:WaitForChild("Shake").Level.Value = 0 
			end
			
		end
	end
end

_G.GenerateGem = GenerateGem -- global function for the admins








function SpinForGem()
	local luck = 0
	for i,v in pairs(game.Players:GetChildren()) do
		luck += 1 * v:WaitForChild("leaderstats").Prestige.Value 
	end
	print(luck)
	for i = 1, 1 do 
		local index = RaritiesService.chooseIndex(Rarities, luck)
		GenerateGem(index, false) -- we pass the index because that is the gem, and we pass false since a admin did not spawn the gem
	end
end





Click.OnServerEvent:Connect(function(player)
	local profile = dataManager.Profiles[player]
	
	if not profile then return end
	
	for i,v in pairs(GemModule) do
		if i == CurrentGem then
			if profile.Data.Lifes.Rebirths == 0 then -- if they have no rebirths then no point in multiplying the power
				profile.Data.Gemstones += v.GPC * profile.Data.Upgrades.Power  
				CGHP -= 1 * profile.Data.Upgrades.Power 
			else
				profile.Data.Gemstones += v.GPC * profile.Data.Upgrades.Power * 2 * profile.Data.Lifes.Rebirths
				CGHP -= 1 * profile.Data.Upgrades.Power * 2 * profile.Data.Lifes.Rebirths
			end

			player.leaderstats["Power"].Value = profile.Data.Upgrades.Power
			player.leaderstats["Gem$tones"].Value = profile.Data.Gemstones
		end
	end
end)






while wait() do
	game.Workspace.HealthCounter.BillboardGui.HP.Text = CGHP -- updates the gems healtj
	if CGHP <= 0 then
		SpinForGem() -- this spins for the gem to spawn
	end
	
	
	
	
	

	
	
	
	
end
