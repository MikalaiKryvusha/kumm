# Medieval Dynasty 2.7.0.3 — raw outlines of world managers and data tables

> Generated 2026-10-08 00:12 +03:00 from the unpacked pak (`D:\Games\Medieval Dynasty Mods\_vanilla`) with `UAssetGUI tojson … VER_UE4_27` and the pack tools `tools/bp-outline.py` / `tools/dt-summary.py` (private repo `MedievalDynasty`). Raw data for the living-world epic (plans/15); conclusions live in `living-world.md` §2. Known gap: enum fields print `None` in `dt-summary.py`.

## BP_NPC_Manager

```
functions: 115
  AddItemsToNeighborhoodBuildings  (79 ops)
  AddNameToAvailableNamesArray  (17 ops)
  AddNPCsThatLeft  (3 ops)
  AddTalkingNPCsManager  (5 ops)
  AddToysToNeighboursKids  (20 ops)
  ChangeTimeToString  (8 ops)
  CheckIfChatterCanBeUsed  (9 ops)
  CheckIfTalkingNPCsManagerExists  (20 ops)
  CheckIsNeighbours  (290 ops)
  CheckNPC_ID  (25 ops)
  CheckVoiceID  (38 ops)
  DecreaseNumberOfChatters  (14 ops)
  DestroyHerald  (43 ops)
  DestroyNPCsThatLeftOnSkip  (30 ops)
  DestroyQuestNPC  (50 ops)
  FilterByBanditType  (22 ops)
  FilterByCharacterType  (16 ops)
  FilterByWealth  (22 ops)
  FindRandomBandChatterDialogue  (106 ops)
  FindRandomChatterDialogue  (98 ops)
  FindRandomChatterDialogueBySubCategories  (100 ops)
  FindSpecialQuestNPC_Dialogue  (9 ops)
  FindUnusedPresets  (42 ops)
  GenerateMergedSkeletalMesh  (43 ops)
  GetBanditNameUsingType  (13 ops)
  GetGeneratedMergedSkeletalMesh  (37 ops)
  GetID_Timestamp  (57 ops)
  GetMeshesByIndexesFromNPCMeshesGen  (225 ops)
  GetNPCPresets  (37 ops)
  GetPresetByProfessionSeasonCharacterType  (62 ops)
  GetPresetByProfessionSeasonWealthCharacterType  (81 ops)
  GetPresetDataTableForNPC  (15 ops)
  GetRandomIndexesFromNPCMeshesGen  (42 ops)
  GetSeasonClothingPresetsForProfession  (77 ops)
  GetUsedChatters  (5 ops)
  GetUsedChattersDialogues  (3 ops)
  IncreaseNumberOfChatters  (11 ops)
  InheritAppearanceParams  (65 ops)
  Init  (3 ops)
  InitAvailableNames  (50 ops)
  InitializePresetTables  (14 ops)
  IsNotTooMuchChatters  (11 ops)
  IsTimeBefore  (27 ops)
  IsTimeBetween  (25 ops)
  IsTimeEqual  (8 ops)
  LoadCharacterMeshes  (127 ops)
  LoadPresetTables  (112 ops)
  LoadSaveFileIntoSystem  (4 ops)
  LoadUsedPresets  (32 ops)
  MeshGenSorter  (37 ops)
  NakedNPCPrevention  (49 ops)
  NeighboursDeath  (66 ops)
  NPCsDeath  (63 ops)
  OnDaySkip  (3 ops)
  OnNPCBirth__DelegateSignature  (2 ops)
  OnNPCDeath__DelegateSignature  (2 ops)
  OnNPCsWedding__DelegateSignature  (2 ops)
  OnParentsExpectingChild__DelegateSignature  (2 ops)
  OnSeasonChanged  (3 ops)
  OnSeasonChanged_Client  (3 ops)
  OnTimeOfDayChanged  (4 ops)
  RandomizeCharacterMeshes  (199 ops)
  RandomName  (56 ops)
  RandomSex  (5 ops)
  ReceiveBeginPlay  (3 ops)
  RefillPresetTable  (21 ops)
  ReloadNeighbours  (61 ops)
  RemoveNPCsThatLeft  (3 ops)
  RemovePresetFromPool  (31 ops)
  RemovePresetsPerVillage  (42 ops)
  RemoveTalkingNPCsManager  (16 ops)
  ResetIllness  (4 ops)
  ResetItemsInNeighborhoodBuildings  (104 ops)
  SaveDataFromSystemToFile  (122 ops)
  SelectHeadAndHair  (9 ops)
  SelectMeshesForNPCGen  (51 ops)
  SelectPresetsForNPC  (25 ops)
  Set NPCRelations  (453 ops)
  SetChatterDialogue  (26 ops)
  SetCustomCharacterMeshes  (10 ops)
  SetMultiNPCRelations  (123 ops)
  SetNeighboursRelations  (25 ops)
  SetNPC_NightPatrol  (38 ops)
  SortByProfession  (22 ops)
  SortBySeason  (22 ops)
  SortMeshes  (30 ops)
  SpawnBand  (141 ops)
  SpawnChild  (30 ops)
  SpawnChildForOfflineMother  (38 ops)
  SpawnGiftVendor  (130 ops)
  SpawnHerald  (120 ops)
  SpawnMultiNPC  (134 ops)
  SpawnNeighbours  (56 ops)
  SpawnNewNeighbours  (72 ops)
  SpawnNPC  (194 ops)
  SpawnNPC_FromSpawner  (110 ops)
  SpawnQuestMultiNPC  (39 ops)
  SpawnQuestNPC  (39 ops)
  SpawnRandomMultiNPC  (138 ops)
  SpawnRandomNPC  (124 ops)
  SpawnWaggoner  (42 ops)
  StartNPCManager  (260 ops)
  StartNPCManager Async  (6 ops)
  TeleportToHouse  (37 ops)
  UpdateNPCsOnSeasonChanged  (130 ops)
  UpdateNPCsOnSeasonChanged_Client  (24 ops)
  UpdatePresetsPerVillage  (17 ops)
  UpdateUsedChatters  (29 ops)
  UpdateUsedChattersDialogues  (7 ops)
  UpdateVendors  (142 ops)
  UpdateWaggoners  (198 ops)
  VerifyAvailablePresets  (38 ops)
  VerifyNPCHeadAndHair  (21 ops)
  VerifyNPCPresets  (88 ops)
variables: 34
  UberGraphFrame:StructProperty
  DefaultSceneRoot:ObjectProperty
  AddSamborFigurines:BoolProperty
  IsBand:BoolProperty
  GlobalNumberOfChatters:IntProperty
  VillagesNumberOfChatters:MapProperty
  NearChatterNPC_ID:StrProperty
  AvailableMaleNames:ArrayProperty
  AvailableFemaleNames:ArrayProperty
  SystemsManagerReference:ObjectProperty
  ChattersSubCategories:ArrayProperty
  ChattersDialoguesNames:ArrayProperty
  NPCs_ID:ArrayProperty
  NewNPCs:ArrayProperty
  AvailableMalePresets:ArrayProperty
  AvailableMaleBanditPresets:ArrayProperty
  AvailableFemalePresets:ArrayProperty
  AvailableBoyPresets:ArrayProperty
  AvailableGirlPresets:ArrayProperty
  AvailableToddlerPresets:ArrayProperty
  NPCsThatLeft:ArrayProperty
  NeighboursHouses:ArrayProperty
  ChattersNamesByCharacterType:MapProperty
  TalkingNPCsManagers:MapProperty
  DeadNPCs:MapProperty
  SpecialQuestNPCDialogues:MapProperty
  NewNeighboursDTHandler:ArrayProperty
  IterationsPerTick:IntProperty
  PresetsPerVillage:MapProperty
  OnNPCDeath:MulticastInlineDelegateProperty
  OnNPCBirth:MulticastInlineDelegateProperty
  OnParentsExpectingChild:MulticastInlineDelegateProperty
  OnNPCsWedding:MulticastInlineDelegateProperty
  MergedSkeletalMeshes:ArrayProperty
```

## BP_VillageManager

```
functions: 98
  AddToTechnologyQueue  (9 ops)
  CanDLCItemExistInWorld  (21 ops)
  CheckBuildingLimit  (29 ops)
  CheckIfTechnologyLevelIsSufficient  (11 ops)
  CheckPillarBonus  (55 ops)
  CheckPilllarLimit  (4 ops)
  CheckTaxesOnSeasonChange  (47 ops)
  CheckTrapLimit  (61 ops)
  CheckVillageSignLimit  (3 ops)
  ConsumeNeedByPeople  (121 ops)
  CreateBuildingsTechnologyArray  (83 ops)
  CreateCraftingRecipesTechnologyLockedArray  (25 ops)
  CreateFencesTechnologyLockedArray  (25 ops)
  CreateFurnituresTechnologyLockedArray  (25 ops)
  CreateGatesTechnologyLockedArray  (23 ops)
  CreatePlatformTechnologyLockedArray  (23 ops)
  DecreaseDynastyReputation  (55 ops)
  Economy_ClientVersion  (28 ops)
  GetFoodStorageInventory_BPI  (3 ops)
  GetOutNPCs  (25 ops)
  GetResourceStorageInventory_BPI  (3 ops)
  GetTechnologies  (6 ops)
  GetTechnology  (18 ops)
  GetWorkersStats  (42 ops)
  IncreaseDynastyReputation  (71 ops)
  IncreaseTax  (6 ops)
  IncreaseTechnology  (345 ops)
  Init  (3 ops)
  InitCrest  (10 ops)
  InitThreadTask  (3 ops)
  InitVillageName  (6 ops)
  LoadNeedOrderFromSave  (67 ops)
  LoadSaveFileIntoSystem  (574 ops)
  LoadSaveFileIntoSystem_OnFinish  (91 ops)
  OnBuildingsInventoryUpdated  (21 ops)
  OnGlobalParametersChange__DelegateSignature  (2 ops)
  OnMinuteUpdate  (3 ops)
  OnMinuteUpdateClient  (3 ops)
  OnRep_CrestData  (97 ops)
  OnRep_PeopleNeedsDisplayed  (3 ops)
  OnRep_PlayerCurrentlyUsingManagement  (28 ops)
  OnRep_VillageNameData  (14 ops)
  OnTechnologyChange__DelegateSignature  (2 ops)
  OnTimeUpdate  (3 ops)
  ReceiveBeginPlay  (3 ops)
  ReceiveEndPlay  (4 ops)
  RefreshResourceStacks  (4 ops)
  RepairBuildings  (20 ops)
  ResetLifeStatsMultipliers  (87 ops)
  SaveDataFromSystemToFile  (315 ops)
  SetTechnology  (281 ops)
  SetUnlockedDevelopmentStage  (24 ops)
  SetVillageSign  (3 ops)
  SetWorkingTime  (12 ops)
  ShouldBeBanished  (4 ops)
  StartVillageManager  (3 ops)
  StopVillageManager  (11 ops)
  Update People Need Order  (137 ops)
  UpdateAnimalFeeding  (80 ops)
  UpdateAnimalsNeeds  (91 ops)
  UpdateAnimalsProduction  (179 ops)
  UpdateBuildingsProduction  (788 ops)
  UpdateBuildingsProduction_Client  (60 ops)
  UpdateBuildingsProductionUIOnly_Client  (268 ops)
  UpdateBuildingsRepairing  (309 ops)
  UpdateBuildingsResourceStacks  (44 ops)
  UpdateBuildingsTrading  (323 ops)
  UpdateBuildingsTrading_Client  (30 ops)
  UpdateCrest  (98 ops)
  UpdateCurrentDevelopmentStage  (157 ops)
  UpdateEconomy  (77 ops)
  UpdateEconomyTask  (3 ops)
  UpdateFoodInventoryLimit  (27 ops)
  UpdateNeeds_Client  (99 ops)
  UpdateNumberOfBuildings  (47 ops)
  UpdateNumberOfTraps  (40 ops)
  UpdateOnBuildingsChange  (3 ops)
  UpdateOnPopulationChange  (3 ops)
  UpdatePeopleNeedsDisplayed  (8 ops)
  UpdatePeopleNeedsDisplayedWithMap  (29 ops)
  UpdatePeoplesNeeds  (383 ops)
  UpdatePillarType  (15 ops)
  UpdatePopulation  (13 ops)
  UpdateResourceInventoryLimit  (27 ops)
  UpdateResourceStacksForStorages  (10 ops)
  UpdateSeasonalAnimals  (27 ops)
  UpdateSeasonalBuildings  (54 ops)
  UpdateSeasonalFields  (52 ops)
  UpdateSeasonalFurnitures  (46 ops)
  UpdateSeasonalNPCs  (20 ops)
  UpdateStorage  (138 ops)
  UpdateTechnology  (25 ops)
  UpdateUsageQueue_Food  (87 ops)
  UpdateUsageQueue_Water  (87 ops)
  UpdateUsageQueue_Wood  (22 ops)
  UpdateVillageName  (15 ops)
  UpdateVillageOnSeasonChange  (3 ops)
variables: 72
  UberGraphFrame:StructProperty
  ResourceStorageInventory:ObjectProperty
  FoodStorageInventory:ObjectProperty
  DefaultSceneRoot:ObjectProperty
  FoodItemsInOrder:MapProperty
  TotalNumberOfFood:FloatProperty
  WoodItemsInOrder:MapProperty
  TotalNumberOfWood:FloatProperty
  Population:IntProperty
  OnGlobalParametersChange:MulticastInlineDelegateProperty
  TotalFoodToConsume:FloatProperty
  TotalWoodToConsume:FloatProperty
  SystemsManagerReference:ObjectProperty
  DynastyReputation:IntProperty
  TechnologyLevel_Building:FloatProperty
  TechnologyLevel_Survival:FloatProperty
  TechnologyLevel_Farming:FloatProperty
  TechnologyLevel_Crafting:FloatProperty
  Technology_ListOfBuildingsPerTechnology:ArrayProperty
  OnTechnologyChange:MulticastInlineDelegateProperty
  CurrentVillageStage:StructProperty
  CurrentTax:FloatProperty
  DebtTax:FloatProperty
  UnlockedVillageStage:StructProperty
  NumberOfBuildings:IntProperty
  Technology_CraftingRecipes_Locked:MapProperty
  Technology_Furnitures_Locked:MapProperty
  Technology_Fences_Locked:MapProperty
  NumberOfTraps:MapProperty
  BaseTrapLimit:IntProperty
  DynastyReputationLimit:IntProperty
  DebtTime:IntProperty
  NoFood_People:IntProperty
  NoWood_People:IntProperty
  NoHome_People:IntProperty
  FoodStorage_HasWorkers:BoolProperty
  ResourceStorage_HasWorkers:BoolProperty
  WorkingTime:BoolProperty
  NoFood_Animals:IntProperty
  NoHome_Animals:IntProperty
  WorkingSeason:IntProperty
  Talent_ProductionModificator:FloatProperty
  WaterItemsInOrder:MapProperty
  TotalNumberOfWater:FloatProperty
  TotalWaterToConsume:FloatProperty
  NoWater_People:IntProperty
  Technology_Gates_Locked:MapProperty
  BuildingsForRepairing:ArrayProperty
  UpdateEconomy_task:ObjectProperty
  LowMood_People:IntProperty
  TasksNoProgress:IntProperty
  TradesNoProgress:IntProperty
  Technology_Platforms_Locked:MapProperty
  TechnologyQueue:MapProperty
  BuildingsToRepair:ArrayProperty
  NPCsToGetOut:MapProperty
  VillageThreadPool:ObjectProperty
  BuildingsInventoryUpdate:ArrayProperty
  FarmShedNoProgress:IntProperty
  PlayerCurrentlyUsingManagement:ObjectProperty
  PillarType:ByteProperty
  CrestData:StructProperty
  VillageNameData:StructProperty
  IsVillageSign:BoolProperty
  RT_Crest_RGB:ObjectProperty
  RT_Flag_RGB:ObjectProperty
  RT_Crest_A:ObjectProperty
  RT_Flag_A:ObjectProperty
  RT_Name:ObjectProperty
  EconomyManager:ObjectProperty
  PeopleNeedsDisplayed:ArrayProperty
  PeopleNeedNames:ArrayProperty
```

## BP_EventManager

```
functions: 50
  AddNPCEffect  (33 ops)
  AssignEventOnSeasonChange  (99 ops)
  CheckDifficulty  (11 ops)
  CheckEventCanFire  (118 ops)
  CheckEventsAvilable  (16 ops)
  ConvertIndexToNPCName  (17 ops)
  ConvertNPCNameToIndex  (10 ops)
  ExecuteEventEffect  (1756 ops)
  ExecuteEventEffect_Client  (547 ops)
  FireEventCheat  (16 ops)
  GatherRestrictionDataForReplication  (69 ops)
  GetNPCEffectByEffectType  (22 ops)
  GetNumberOfBuildBuildings  (57 ops)
  GetOtherEffectByEffectType  (21 ops)
  GetPlayerEffectByEffectType  (26 ops)
  GetSkillLevelForRestriction  (48 ops)
  Init  (4 ops)
  ItemRestriction  (295 ops)
  ListStuff  (3 ops)
  LoadSaveFileIntoSystem  (56 ops)
  OnEventSelected_Multicast  (4 ops)
  OnHostSelectedOption__DelegateSignature  (2 ops)
  OnPlayerMultipliersChanged__DelegateSignature  (2 ops)
  OnPlayerVoted__DelegateSignature  (2 ops)
  OnPlayerVoted_Multicast  (4 ops)
  OnRep_PlayerMultiplliers  (3 ops)
  OnRep_SelectedEventButtonIndex  (8 ops)
  PlayerVoted  (27 ops)
  RemovePlayerVote__DelegateSignature  (2 ops)
  RemoveRosourcesFromRestrictions  (81 ops)
  ReplicateConsequences_Multicast  (8 ops)
  ReplicateRestrictions_Multicast  (4 ops)
  ResetSelectedEventButtonIndex  (6 ops)
  RestrictionAnimals  (31 ops)
  RestrictionBuildings  (102 ops)
  RestrictionFields  (68 ops)
  RestrictionNPC  (120 ops)
  RestrictionPlayer  (136 ops)
  RestrictionSeason  (17 ops)
  RestrictionTime  (11 ops)
  SaveDataFromSystemToFile  (25 ops)
  SearchInventoryForItems  (103 ops)
  SetPlayerMultipliers  (6 ops)
  SkillRestriction  (44 ops)
  StartEventSystem  (5 ops)
  ToggleEventScreen_Multicast  (6 ops)
  TryToUnlockCrests  (4 ops)
  VillageRestriction  (67 ops)
  WindowCanBeClosed__DelegateSignature  (2 ops)
variables: 19
  UberGraphFrame:StructProperty
  DefaultSceneRoot:ObjectProperty
  SystemsManagerReference:ObjectProperty
  EventQueue:ArrayProperty
  LastEvents:ArrayProperty
  IsEventForThisSeason:BoolProperty
  EventNumber:IntProperty
  EventHappenChance:FloatProperty
  EventsHistory:ArrayProperty
  SpecyficNPCs:ArrayProperty
  ItemFoundIn:ArrayProperty
  VotingPlayers:ArrayProperty
  OnPlayerVoted:MulticastInlineDelegateProperty
  RemovePlayerVote:MulticastInlineDelegateProperty
  PlayersMultiplliers:StructProperty
  OnHostSelectedOption:MulticastInlineDelegateProperty
  OnPlayerMultipliersChanged:MulticastInlineDelegateProperty
  SelectedEventButtonIndex:IntProperty
  WindowCanBeClosed:MulticastInlineDelegateProperty
```

## BP_KingdomManager

```
functions: 19
  CalculateModifiers  (198 ops)
  CalculateReputation  (50 ops)
  CheckChallengeAvilable  (43 ops)
  CheckChallengeCanBeAssigned  (100 ops)
  ChooseAChallenge  (54 ops)
  ConvertKingToIDs  (23 ops)
  DeathOfTheKing  (3 ops)
  GetChallengeCheat  (34 ops)
  GetKingInfo  (26 ops)
  Init  (2 ops)
  KingdomCheat  (9 ops)
  Load Kingdom Data  (37 ops)
  NewKing  (156 ops)
  RerollChallenge  (29 ops)
  SaveKingdomData  (14 ops)
  StartKingdomSystem  (5 ops)
  TryToKillKing  (10 ops)
  UpdateKingdom  (169 ops)
variables: 18
  UberGraphFrame:StructProperty
  DefaultSceneRoot:ObjectProperty
  HistoricalListOfKings:ArrayProperty
  CurrentKing:StructProperty
  MortalityCurve:ObjectProperty
  SystemsManagerReference:ObjectProperty
  ChallengeHappenChance:FloatProperty
  LastChallenges:ArrayProperty
  ChallengeInProgress:ByteProperty
  HeraldID:StrProperty
  ChangedReputation:BoolProperty
  LastChallengeSkipped:BoolProperty
  TaxModifier:FloatProperty
  MoodModifier:FloatProperty
  KingdomStatus:ByteProperty
  KingdomStatusChangeChance:FloatProperty
  ChanceToKillKing:FloatProperty
  ChallengeRerollOnLoad:BoolProperty
```

## BP_POI_Manager

```
functions: 46
  CanSpawnAnyOfType  (32 ops)
  CanSpawnPOI  (17 ops)
  CheckForPotentialErrors  (487 ops)
  CheckPOI_ID  (36 ops)
  CheckRestrictions  (28 ops)
  DespawnAll  (19 ops)
  DisableAndDespawnPoi  (4 ops)
  DisablePoi  (3 ops)
  DisablePoiByID  (3 ops)
  EnablePoi  (3 ops)
  EnablePoiById  (3 ops)
  FindClosestAvailablePOIofType  (39 ops)
  FindClosestBanditPOIForQuest  (76 ops)
  FixSomePOIsNPCs  (136 ops)
  ForceDespawn  (9 ops)
  ForceDespawnByPoiId  (10 ops)
  ForceReloadLoad  (23 ops)
  ForceSpawn  (24 ops)
  ForceSpawnByPoiId  (10 ops)
  GetPoiById  (60 ops)
  Init  (43 ops)
  InitCategory  (28 ops)
  Is Poi Eligible for Spawn  (7 ops)
  IsMP_MapEditor  (5 ops)
  LoadSpawners  (67 ops)
  LoadSpawnersAsync  (7 ops)
  POI_CheckAvailability  (17 ops)
  POI_DisablePreviewAll  (19 ops)
  POI_EnablePreviewAll  (32 ops)
  POI_ShowPositionInGame  (43 ops)
  ReceiveTick  (4 ops)
  ReloadAfterSettingsChanged  (11 ops)
  SaveSpawners  (279 ops)
  SpawnAdditionalPoisByCategory  (61 ops)
  SpawnAll  (48 ops)
  SpawnAllActiveSpawners  (3 ops)
  SpawnCategory  (38 ops)
  SpawnCategoryRestricted  (141 ops)
  SpawnLoadNew  (28 ops)
  SpawnOnNewGame  (18 ops)
  SpawnOnSaveLoad  (4 ops)
  SpawnRandom  (39 ops)
  StartPOISystem  (5 ops)
  TryDespawn  (24 ops)
  UpdatePOI_Array  (63 ops)
variables: 22
  UberGraphFrame:StructProperty
  DefaultSceneRoot:ObjectProperty
  Preview:BoolProperty
  SystemsManagerReference:ObjectProperty
  POI_Spawners:ArrayProperty
  NewGamePOIs:ArrayProperty
  DrawRestrictions:MapProperty
  MaxNumberOfActiveSpawners:IntProperty
  MaxTries:IntProperty
  SpawnersCategorized:MapProperty
  Separator:ArrayProperty
  TestSave:ArrayProperty
  CategorizedSpawners:MapProperty
  ActiveSpawners:ArrayProperty
  ActiveSpawnersHistory:ArrayProperty
  DisabledPOIs:SetProperty
  LengthOfDeactivation:IntProperty
  TestSaveOnlyActive:ArrayProperty
  RestartPOI:BoolProperty
  DisplayWarnings:BoolProperty
  POIsPerTick:IntProperty
  bDisplayPositionInGame:BoolProperty
```

## BP_AnimalsManager

```
functions: 55
  CalculateAnimalLocation  (42 ops)
  CheckAnimals  (3 ops)
  CheckAnimalsThread  (3 ops)
  CheckAreaAvailability  (19 ops)
  CheckIsWater  (33 ops)
  CheckSpawnersID  (80 ops)
  DisableAllSpawners  (18 ops)
  DisableSpawnersOfType  (28 ops)
  EnableAllSpawners  (18 ops)
  EnableSpawnersOfType  (28 ops)
  FindClosestFishesPoints  (28 ops)
  FindClosestWildAnimalsPoints  (29 ops)
  GetAnimalDataByName  (93 ops)
  GetRandomActiveLegendaryAnimal  (120 ops)
  Init  (3 ops)
  InitializeMultiplayerAnimalRoutines  (153 ops)
  InitThreadTask  (3 ops)
  LoadDataSafely  (7 ops)
  LoadSaveFileIntoSystem  (351 ops)
  ReceiveBeginPlay  (3 ops)
  ReceiveEndPlay  (4 ops)
  RefreshWildAnimalsArray  (21 ops)
  ReloadAfterSettingsChanged  (19 ops)
  RemoveNeighborhoodRedundantAnimals  (33 ops)
  RemoveRandomCountOfHusbandryAnimalsOnEvent  (47 ops)
  SaveDataFromSystemToFile  (38 ops)
  SeasonalUpdateSpawners  (294 ops)
  SetNumberOfAnimalsInSpawner  (25 ops)
  SetNumberOfAnimalsInSpawners  (92 ops)
  SetNumberOfFishesInSpawner  (10 ops)
  SetNumberOfFishesInSpawners  (20 ops)
  SpawnAnimalsToNeighborhoodBuilding  (27 ops)
  SpawnAnimalsToNeighborhoodBuildings  (32 ops)
  SpawnFishInSpawner  (4 ops)
  SpawnGroundAnimalsInSpawnerFromSave  (158 ops)
  SpawnHusbandryAnimal  (125 ops)
  SpawnHusbandryAnimals  (20 ops)
  SpawnOnDemand  (3 ops)
  StartAnimalsManager  (5 ops)
  StopAnimalsManager  (11 ops)
  StopCheckAnimals  (3 ops)
  TeleportToHome  (125 ops)
  TeleportToHomeLocation  (66 ops)
  TeleportToLocation  (6 ops)
  UncoverSpawnerAnimal  (8 ops)
  UncoverSpawnerFish  (8 ops)
  UpdateListOfSpawners  (133 ops)
  UpdateMultiplayerAnimals  (3 ops)
  UpdateMultiplayerAnimalsLocations  (287 ops)
  UpdateOnSeasonChanged  (3 ops)
  UpdateSpawners  (69 ops)
  UpdateSpawners_Complete  (3 ops)
  UpdateSpawnersComplete  (234 ops)
  WaitForMutexUnlock  (7 ops)
variables: 43
  UberGraphFrame:StructProperty
  DefaultSceneRoot:ObjectProperty
  SystemsManagerReference:ObjectProperty
  AnimalThreadPool:ObjectProperty
  WildAnimals:ArrayProperty
  TimerCheckAnimals:StructProperty
  CheckAnimalsUpdateDelay:FloatProperty
  DistanceOfBrainActivity:FloatProperty
  DistanceOfBrainActivitySquared:FloatProperty
  LegendaryWildAnimalSpawners_Limit:IntProperty
  LegendaryWildAnimalSpawners_NewPerSeason:IntProperty
  LegendaryWildAnimalSpawners_MinSeasonsOfActivity:IntProperty
  LegendaryWildAnimalSpawners_MaxSeasonsOfActivity:IntProperty
  LegendaryWildAnimalSpawners_SeasonsOfInactivity:IntProperty
  LegendaryFishSpawners_Limit:IntProperty
  LegendaryFishSpawners_SeasonsOfInactivity:IntProperty
  HusbandryAnimalsRemovedByEvent:MapProperty
  ShowDebugInfo:BoolProperty
  AllowSpawnAnimals:BoolProperty
  SpawnPointsWildAnimals:ArrayProperty
  SpawnPointsFishes:ArrayProperty
  WasAnimalSpawnUncovered:MapProperty
  SpawnPointsWildAnimalCategorized:MapProperty
  AnimalTypesToDisable:SetProperty
  SpawnPointsFishCategorized:MapProperty
  UncoveredSpawners:ArrayProperty
  UncoveredFishSpawners:ArrayProperty
  CheckAnimals_Task:ObjectProperty
  SpawnersToUncover:SetProperty
  SpawnersToActivate:SetProperty
  SpawnersToDeactivate:SetProperty
  FlocksToUncover:SetProperty
  FlocksToActivate:SetProperty
  FlocksToDeactivate:SetProperty
  CheckAnimals_Mutex:ObjectProperty
  ShowVerboseInfo:BoolProperty
  RoutinesBuildings:ArrayProperty
  MultiplayerAnimalsUpdateTimer:StructProperty
  MinDistanceFromPlayersToUpdateAnimals:FloatProperty
  MinDistanceFromPlayersToUpdateAnimalsIfNotLooking:FloatProperty
  MutexUnlockHandle:StructProperty
  ActivatedLegendaryWildAnimalSpawners:ArrayProperty
  ActivatedLegendaryFishSpawners:ArrayProperty
```

## BP_GameplayEventsManager

```
functions: 3
  Init  (4 ops)
  ReceiveBeginPlay  (3 ops)
variables: 2
  UberGraphFrame:StructProperty
  DefaultSceneRoot:ObjectProperty
```

## BP_TimeManager

```
functions: 88
  ApplyByteVarUpdate  (4 ops)
  ApplySkeletalMontagesUpdate  (4 ops)
  CallSpawnSeasonJournal  (3 ops)
  CanSkipSeason  (95 ops)
  CheatSkipInstant  (3 ops)
  CheckHowMuchTimeIsMissing_Hour  (51 ops)
  CheckHowMuchTimeIsMissingToSkipSeason  (57 ops)
  CheckifTimeIsInHourRange  (81 ops)
  CheckIfTimeIsPast  (48 ops)
  CheckSeasonSkip  (12 ops)
  CheckSleepingPlayers  (109 ops)
  CheckTimeBetween  (45 ops)
  CheckTimeBetweenHours  (27 ops)
  ContinueWithSkipSeason  (32 ops)
  ContinueWithSkipSeason_BPI  (3 ops)
  DeleteCurrentSeasonWidgets  (30 ops)
  ExecuteActorUpdate  (4 ops)
  GetAnyDataCollectedInVillageManager  (4 ops)
  GetCurrentSeason  (9 ops)
  GetCurrentYear  (3 ops)
  GetMontagesForReplicaton_BPI  (3 ops)
  GetSeasonJournal  (14 ops)
  IncreaseTime  (78 ops)
  Init  (6 ops)
  InstantlyUpdateTimeAndWeather  (7 ops)
  InstantlyUpdateTimeAndWeather_Multicast  (7 ops)
  InstantlyUpdateTimeAndWeather_Server  (7 ops)
  IsItPossibleToSkipSeason  (24 ops)
  IsItPossibleToSleep  (25 ops)
  LoadSaveFileIntoSystem  (10 ops)
  OnContinueWithSkipSeason__DelegateSignature  (2 ops)
  OnDaySkip__DelegateSignature  (2 ops)
  OnDaySkipStart__DelegateSignature  (2 ops)
  OnGameStart__DelegateSignature  (2 ops)
  OnRep_Time  (29 ops)
  OnSeasonChanged__DelegateSignature  (2 ops)
  OnSeasonChanged_End__DelegateSignature  (2 ops)
  OnSkipFadeFinished  (3 ops)
  OnTimeOfDay_NPC_Changed__DelegateSignature  (2 ops)
  OnTimeOfDay_SeasonalVisuals_Changed__DelegateSignature  (2 ops)
  OnTimeUpdate__DelegateSignature  (2 ops)
  OnTimeUpdate_Days__DelegateSignature  (2 ops)
  OnTimeUpdate_Hours__DelegateSignature  (2 ops)
  OnTimeUpdate_Minutes__DelegateSignature  (2 ops)
  ProcessByteVarUpdate  (5 ops)
  ProcessSkeletalMontagesUpdate  (5 ops)
  RandomizeTime  (44 ops)
  ReceiveBeginPlay  (3 ops)
  RequestActorUpdate  (5 ops)
  RequestSkip  (3 ops)
  SaveDataFromSystemToFile  (3 ops)
  SeasonSkipFinish  (30 ops)
  SeasonSkipFinish_Client  (28 ops)
  SetDeathTypeWidgetToSpawn  (3 ops)
  SetGlobalTimeSpeed  (3 ops)
  SetPauseTime  (9 ops)
  SetSpawnDeathMenuWidget  (3 ops)
  SetTimeAndWeather  (23 ops)
  SetWasActorUpdated_BPI  (4 ops)
  SkipDay  (4 ops)
  Skipday_Client  (3 ops)
  SkipDay_Multicast  (4 ops)
  SkipSeason  (4 ops)
  SkipSeason_Multicast  (5 ops)
  SkipWhenPosible  (3 ops)
  SleepCameraUnfaded  (3 ops)
  SpawnDeathMenu  (28 ops)
  StartSkipSeason_Multicast  (3 ops)
  StartTimeManager  (27 ops)
  StartTimer  (9 ops)
  StartTimerEvent  (3 ops)
  StopFadeSkipDay  (3 ops)
  StopFadeSkipSeason  (3 ops)
  StopSkipSeasonCheck  (3 ops)
  StopTimeManager  (3 ops)
  StopTimer  (5 ops)
  UpdateByTimer  (36 ops)
  UpdateByTimer_Client  (15 ops)
  UpdateRestAchievement  (21 ops)
  UpdateTimeClients_Multicast  (4 ops)
  UpdateTimeOfDay_NPC  (71 ops)
  UpdateTimeOfDay_SeasonalVisuals  (37 ops)
  UpdateTimeToSaveOnSettingsChanged  (10 ops)
  UpdateTotalSecondsToSkipSeason  (3 ops)
  UserConstructionScript  (7 ops)
  WasActorUpdated_BPI  (3 ops)
  WinterSurvival  (33 ops)
variables: 51
  UberGraphFrame:StructProperty
  DefaultSceneRoot:ObjectProperty
  StartTime:StructProperty
  StartWeatherVariation:IntProperty
  MainMenuTime:StructProperty
  MainMenuWeatherVariant:IntProperty
  MainMenuRandomSeason:BoolProperty
  HourAfterSkip:StructProperty
  Timespan:IntProperty
  TimeUpdateDelay:FloatProperty
  OnTimeOfDay_NPC_Changed:MulticastInlineDelegateProperty
  TimeOfDay_NPC:ByteProperty
  TimeOfDay_SeasonalVisuals:ByteProperty
  Time:StructProperty
  TimerReference:StructProperty
  TimeMultiplier:FloatProperty
  OnTimeOfDay_SeasonalVisuals_Changed:MulticastInlineDelegateProperty
  OnDaySkipStart:MulticastInlineDelegateProperty
  OnDaySkip:MulticastInlineDelegateProperty
  PauseTime:StructProperty
  CheckPauseTime:BoolProperty
  OnTimeUpdate:MulticastInlineDelegateProperty
  OnTimeUpdate_Minutes:MulticastInlineDelegateProperty
  OnTimeUpdate_Hours:MulticastInlineDelegateProperty
  OnTimeUpdate_Days:MulticastInlineDelegateProperty
  OnSeasonChanged:MulticastInlineDelegateProperty
  SleepTimeStart:StructProperty
  SleepTimeEnd:StructProperty
  TotalSecondsToSkipSeason:IntProperty
  SystemsManagerReference:ObjectProperty
  CurrentSeasonSeconds:IntProperty
  ChangeTimeOnSkip:BoolProperty
  OnSeasonChanged_End:MulticastInlineDelegateProperty
  IsSkippingInProgress:BoolProperty
  IteratorNumber:IntProperty
  TimeFlowStoppedByCheat:BoolProperty
  Teleport Player:BoolProperty
  TimeToAutosave:FloatProperty
  RemainingTimeToAutosave:FloatProperty
  OnGameStart:MulticastInlineDelegateProperty
  CanTimeFlowOnMultiplayer:BoolProperty
  SkipTimerHandle:StructProperty
  bInitiallyUpdated:BoolProperty
  SkipSeasonWidget:ObjectProperty
  SpawnEvent:BoolProperty
  OnContinueWithSkipSeason:MulticastInlineDelegateProperty
  SpawnHeirHairCutEvent:BoolProperty
  SpawnDeathMenuWidget:BoolProperty
  DeathTypeWidgetToSpawn:ByteProperty
  amountOfSleepHours:IntProperty
  InstantSkip:BoolProperty
```

## BP_EconomyManager

```
functions: 25
  Add Used Durability  (16 ops)
  AddItem  (45 ops)
  DayChanged  (12 ops)
  GetProductionArrayTypeBySeason  (8 ops)
  InitSystem  (9 ops)
  LoadEconomyData  (116 ops)
  MockDurabilityData  (38 ops)
  MockRandomItem  (21 ops)
  OnItemProduced__DelegateSignature  (2 ops)
  OnItemUsed__DelegateSignature  (2 ops)
  OnPlayerJoin  (27 ops)
  OnRep_AutumnProduction  (3 ops)
  OnRep_CurrentYearProduction  (3 ops)
  OnRep_LastYearProduction  (3 ops)
  OnRep_SpringProduction  (3 ops)
  OnRep_SummerProduction  (3 ops)
  OnRep_TodayProduction  (3 ops)
  OnRep_TotalProduction  (3 ops)
  OnRep_WinterProduction  (3 ops)
  OnRep_YesterdayProduction  (3 ops)
  ReceiveBeginPlay  (3 ops)
  SaveEconomyData  (77 ops)
  SeasonChanged  (23 ops)
  ToolActivityToInteger  (25 ops)
variables: 5
  UberGraphFrame:StructProperty
  OnItemProduced:MulticastInlineDelegateProperty
  OnItemUsed:MulticastInlineDelegateProperty
  TimeManager:ObjectProperty
  SystemsManager:ObjectProperty
```

## DT_Events

```
rows: 65
fields of first row:
  Name_4_EA7DF8214AC3A4CE90F647BDFEDD58B4  =  DangerousStorm
  Description_5_2C16EA0E4DA06E137EC074B117DDAFA3  =  DangerousStorm
  Icon_52_29BD7BC143913E397216ADACC3B15161  =  {"$type": "UAssetAPI.PropertyTypes.Objects.FSoftObjectPath, UAssetAPI", "AssetPath": {"$ty
  GoodEvent_42_2E0F323341646C74A8D14EB728A88763  =  False
  MapAvailable_56_70350E5D49D35199C6301D89637C58E5  =  [2]
  Difficulty_51_F96F8BAE40766BA8503485A112A4F6B5  =  None
  Weight_48_1F82B6894DEDA1398E1B4282F5AB2040  =  1
  Restrictions_36_32144C894D0545E7F01B52A81E452683  =  [2]
  EventButtons_40_E4EF579B43F4DFDB4C58F296EF6280B0  =  [1]
row names:
  Storm
  Vermins
  HowlTerror
  ScarecrowNeeded
  Fever
  Thief
  Teacher
  Nobleman
  HeavyRains
  Rainbow
  ScorchingSun
  BlackClouds
  GoldenAutumn
  WindOfChanges1
  WindOfChanges2
  Snow
  MoodyVillagers
  CryWolf
  Inspiration
  WarTaxes
  NewsWar
  TravelingMerchant
  WeddingDay
  HuntingIncident
  SpringBloom
  RustInPeace
  Miasma
  Kidnapping
  SuspiciousStranger
  SuspiciousStrangerValley
  BoarSlayer
  Snout
  DidntStartFire
  LostInTheDark
  CoinRules
  Bribery
  RainyDay
  TheRatcatcher
  RatCoins
  ModernisationProgramme
  CowCompetition
  TheRunaways
  TeachViolence
  MyInn
  Knightmare
  RunawayBride
  BalladOfLove
  TheWiseWisent
  WhiteSpring
  AnOutlaw
  InfectionAffection
  Gluttony
  BanditRaid
  BanditsHere
  WhereBandits
  FormidableFortress
  TheKingDead
  BirthdayTax
  ToArms
  ShatteredJourney
  Caravan
  TheGoodTheBad
  LostInTransportation
  Headwolf
  WhiteWolf
```

## DT_VillagesOriginAndRange

```
rows: 14
fields of first row:
  Village_6_E36CDDCA4601595C84224B9CA7CE20F0  =  None
  Origin_7_1268E0A14CC9C726FA48DE9C244B75C2  =  [1]
  Range_8_84ACE46744B31CE4F64945B1B255D24F  =  3000.0
row names:
  Player
  Ownerless
  Bandit
  BlueVillage
  GreenVillage
  SkyBlueVillage
  RedVillage
  PinkVillage
  OrangeVillage
  YellowVillage
  PurpleVillage
  NavyBlueVillage
  BurgundyVillage
  BrownVillage
```

## DT_BanditData

```
rows: 28
fields of first row:
  Name_84_A8378F794500909F8E8F55B615FBCACE  =  BanditWeak Archer 
  MaxHealth_78_A56D8CA34F75A3FBBF38DABB2008101F  =  1.0
  Courage_87_23C2967D4CECA93841E35D9A0B641F74  =  0.25
  ReputationForKill_81_D99292A4464FE4FD74CEA5B804CB59F2  =  5
  HoldableItems_75_4F005FE643402EEFFC0053AFE3AB5996  =  [2]
  FakeEquippedItems_61_2EC5D4C844BB97F0C0BA968C274DDAD0  =  [1]
  OtherItems_60_027BC4F1436CFC96CE233AB713B643BA  =  [3]
row names:
  Archer0
  Archer1
  Archer2
  Axeman0
  Axeman1
  Axeman2
  Batman0
  Batman1
  Batman2
  Bruiser0
  Bruiser1
  Bruiser2
  Crossbowman0
  Crossbowman1
  Crossbowman2
  Cutthroat0
  Cutthroat1
  Cutthroat2
  Footman0
  Footman1
  Footman2
  Marauder0
  Marauder1
  Marauder2
  Spearman0
  Spearman1
  Spearman2
  Custom0
```

## DT_Quests_Generated

```
rows: 40
fields of first row:
  QuestID_38_7BA6032F4D2786BDD742958980780B0E  =  AnimalOvercrowding
  Name_3_5D2BD6C041E961D204DEE58649580481  =  Animal Overcrowding
  Category_5_3F9CD7B34498DC27ACE65D88B31F4EC9  =  None
  Description_8_CDF99D7C4F708C33E5AB71AF2F79099F  =  The number of those animals is too high. I must try to reduce it to restore balance in the
  RestrictionsForGeneratedQuests_49_A296082945844B7D3EA2F49E6C0C3064  =  [10]
  RestrictionsForChallenges_77_F6B2EFA54A4A73FCA6B203A51DD896F9  =  [7]
  GenerateQuestReward_74_A7AE080541A134EF1150A0A51B20D338  =  [3]
  CompletionReward_24_A22815F248046F0828C245A1FB71C7FE  =  [7]
  GenerateObjectivesForQuest_70_ADA0E9C44576CEAF250F60833634C48E  =  [3]
  QuestObjectives_42_A3C4FB214AAA7EAAF9CAAA849961E628  =  [2]
  State_23_DFCF9AD04F25106777C87B88F01CC887  =  None
  QuestGiverNPCID_52_EFF2F8514820EFD26A38388C6F28872D  =  None
  QuestGiver_48_B6B77A4E42001A9FA2A978B04572B3CA  =  
  Duration_31_196C34394ECEAC57CE005F86BD88975C  =  1
  SeasonalCheckForDuration_32_AA8A21484DAED07E75D882A3F71BE0D6  =  True
  QuestGiverMaxAge_58_37331E404AE7C7800BB0C28297D4A86B  =  0
  NextQuests_66_83B225014B04B26EBB48A4AFD9AB6C37  =  [0]
  WasQuestRewardGiven_60_0C79F05A473D01936405B3AFE0AE565B  =  False
  QuestFailPenalty_81_5D6D335743E20E1DB33AB39F099FF99F  =  [2]
  DescriptionStringTableKeys_85_DF7D943E46F473CAC247AFA3166BA833  =  [0]
row names:
  AnimalOvercrowding
  HoleInTheRoof
  JustLikePapa
  MouthsToFeed
  OldRags
  Thirst
  TimeToHunt
  Handyman
  BerryJuice-Summer
  BerryJuice-Spring
  MayItBurn
  Beggar
  HighValueItem
  NightHunt
  FamilyDispute
  BOY
  DeliveryBoy
  FoodProcessing
  NightHowl
  AChallenger
  DessertTime
  Dept
  MineBear
  IronShortage
  LittleGarden
  SewingProblem
  SewMe
  HouseRebuilding
  StarvingHunter
  DestroyedCrops
  NewField
  NewAxe
  WoodcutterChallange
  MushroomTreatment
  MissingBow
  Renovation
  LavishMeal
  Bucket
  WarmClothes
  StarvingHunter_Winter
```

## DT_NoticeBoardQuests

```
rows: 35
fields of first row:
  QuestID_38_7BA6032F4D2786BDD742958980780B0E  =  Weapons
  Name_3_5D2BD6C041E961D204DEE58649580481  =  We Need Your Spear, and Your Bow, and Your Axe!
  Category_5_3F9CD7B34498DC27ACE65D88B31F4EC9  =  None
  Description_8_CDF99D7C4F708C33E5AB71AF2F79099F  =  By the order of the Castellan, all townspeople capable of wielding a weapon should be arme
  RestrictionsForGeneratedQuests_49_A296082945844B7D3EA2F49E6C0C3064  =  [10]
  RestrictionsForChallenges_77_F6B2EFA54A4A73FCA6B203A51DD896F9  =  [7]
  GenerateQuestReward_74_A7AE080541A134EF1150A0A51B20D338  =  [3]
  CompletionReward_24_A22815F248046F0828C245A1FB71C7FE  =  [7]
  GenerateObjectivesForQuest_70_ADA0E9C44576CEAF250F60833634C48E  =  [3]
  QuestObjectives_42_A3C4FB214AAA7EAAF9CAAA849961E628  =  [0]
  State_23_DFCF9AD04F25106777C87B88F01CC887  =  None
  QuestGiverNPCID_52_EFF2F8514820EFD26A38388C6F28872D  =  None
  QuestGiver_48_B6B77A4E42001A9FA2A978B04572B3CA  =  
  Duration_31_196C34394ECEAC57CE005F86BD88975C  =  1
  SeasonalCheckForDuration_32_AA8A21484DAED07E75D882A3F71BE0D6  =  True
  QuestGiverMaxAge_58_37331E404AE7C7800BB0C28297D4A86B  =  0
  NextQuests_66_83B225014B04B26EBB48A4AFD9AB6C37  =  [0]
  WasQuestRewardGiven_60_0C79F05A473D01936405B3AFE0AE565B  =  False
  QuestFailPenalty_81_5D6D335743E20E1DB33AB39F099FF99F  =  [2]
  DescriptionStringTableKeys_85_DF7D943E46F473CAC247AFA3166BA833  =  [0]
row names:
  Weapons
  RabidRabbit
  KillThePigeons
  Fox
  BadgerBadger
  BoarToBeWild
  WolvesAmongUs
  Crows
  Burnthewitch
  Stew
  Mushrooms
  Pigsty
  Feathers
  KnifeSwindler
  BeetrootBaron
  LostHammer
  Arrows
  Buckets
  Fertiliser
  Reaper
  Fish
  HoesBeforeBros
  Potions
  PotionOfSobriety
  BridgeRestoration
  Palisade
  Stones
  Wine
  Beer
  ShovelAndBag
  Onions
  StallCover
  FishingSpears
  Salt
  WickerBasket
```

## DT_ListOfVendors

```
rows: 34
fields of first row:
  Icon_8_A67E0B9A487FB7511483E0BA4BD787E1  =  -41
  Items_4_5AC4A447478D715ED02AE2B513C06A6F  =  [7]
row names:
  Lumberjack1
  Miner1
  Hunter1
  Herbalist1
  Removed
  Fisherman1
  Blacksmith1
  Blacksmith2
  Blacksmith3
  Cook1
  Cook2
  Innkeeper1
  Seamster1
  Seamster2
  Seamster3
  Beekeeper1
  Farmer1
  Craftsman1
  Craftsman2
  Craftsman3
  AnimalBreederFold1
  AnimalBreederPigsty1
  AnimalBreederStable1
  AnimalBreederPoultry1
  AnimalBreederCowshed1
  Exotic1
  Figurines1
  Exotic2
  StallholderTools1
  StallholderClothing1
  StallholderResources1
  StallholderFood1
  StallholderHerbs1
  SpecialSaltySnacks1
```

## DT_VendorVillages

```
rows: 17
fields of first row:
  Village_8_8D6BA46E419F5A261D5621AFB7080040  =  [2]
row names:
  Lumberjack_1
  Miner_1
  Hunter_1
  Herbalist_1
  Fisherman_1
  Blacksmith_3
  Innkeeper_1
  Seamster_3
  Beekeeper_1
  Farmer_1
  Craftsman_3
  AnimalBreeder_Fold_1
  AnimalBreeder_Pigsty_1
  AnimalBreeder_Stable_1
  AnimalBreeder_Poultry_1
  AnimalBreeder_Cowshed_1
  Cook_2
```

## DT_ReputationLimits

```
rows: 150
fields of first row:
  RequiredReputation_2_A23866B248220DA64A2658A6D85E2582  =  100
row names:
  Population_1
  Population_2
  Population_3
  Population_4
  Population_5
  Population_6
  Population_7
  Population_8
  Population_9
  Population_10
  Population_11
  Population_12
  Population_13
  Population_14
  Population_15
  Population_16
  Population_17
  Population_18
  Population_19
  Population_20
  Population_21
  Population_22
  Population_23
  Population_24
  Population_25
  Population_26
  Population_27
  Population_28
  Population_29
  Population_30
  Population_31
  Population_32
  Population_33
  Population_34
  Population_35
  Population_36
  Population_37
  Population_38
  Population_39
  Population_40
  Population_41
  Population_42
  Population_43
  Population_44
  Population_45
  Population_46
  Population_47
  Population_48
  Population_49
  Population_50
  Population_51
  Population_52
  Population_53
  Population_54
  Population_55
  Population_56
  Population_57
  Population_58
  Population_59
  Population_60
  Population_61
  Population_62
  Population_63
  Population_64
  Population_65
  Population_66
  Population_67
  Population_68
  Population_69
  Population_70
  Population_71
  Population_72
  Population_73
  Population_74
  Population_75
  Population_76
  Population_77
  Population_78
  Population_79
  Population_80
  Population_81
  Population_82
  Population_83
  Population_84
  Population_85
  Population_86
  Population_87
  Population_88
  Population_89
  Population_90
  Population_91
  Population_92
  Population_93
  Population_94
  Population_95
  Population_96
  Population_97
  Population_98
  Population_99
  Population_100
  Population_101
  Population_102
  Population_103
  Population_104
  Population_105
  Population_106
  Population_107
  Population_108
  Population_109
  Population_110
  Population_111
  Population_112
  Population_113
  Population_114
  Population_115
  Population_116
  Population_117
  Population_118
  Population_119
  Population_120
  Population_121
  Population_122
  Population_123
  Population_124
  Population_125
  Population_126
  Population_127
  Population_128
  Population_129
  Population_130
  Population_131
  Population_132
  Population_133
  Population_134
  Population_135
  Population_136
  Population_137
  Population_138
  Population_139
  Population_140
  Population_141
  Population_142
  Population_143
  Population_144
  Population_145
  Population_146
  Population_147
  Population_148
  Population_149
  Population_150
```

## DT_Production_Mine_Miner

```
rows: 5
fields of first row:
  RecipeHandler_29_4AA9F44743C16333A1D9209168858ACD  =  [2]
  BaseProductionPerHour_9_62B9692C47FC72EC4AF8BAAAFF49FC84  =  [4]
  CheckAnimals_15_2B59E223419A5B2FED9CB9A5B59C3830  =  False
  Animal_25_3B631E124E9C1F04626E3386CF720572  =  [0]
row names:
  Rock
  Salt
  CopperOre
  TinOre
  IronOre
```

## DT_Production_Smithy1_Blacksmith

```
rows: 96
fields of first row:
  RecipeHandler_29_4AA9F44743C16333A1D9209168858ACD  =  [2]
  BaseProductionPerHour_9_62B9692C47FC72EC4AF8BAAAFF49FC84  =  [4]
  CheckAnimals_15_2B59E223419A5B2FED9CB9A5B59C3830  =  False
  Animal_25_3B631E124E9C1F04626E3386CF720572  =  [0]
row names:
  CopperBar
  TinBar
  BronzeBar
  IronBar
  StoneAxe
  CopperAxe
  BronzeAxe
  IronAxe
  WoodenBuildingHammer
  CopperHammer
  BronzeHammer
  IronBuildingHammer
  StoneSkinningKnife
  CopperKnife
  BronzeKnife
  IronSkinningKnife
  WoodenHoe
  StoneHoe
  CopperHoe
  BronzeHoe
  IronHoe
  StonePickaxe
  BronzePickaxe
  Pickaxe
  StoneSickle
  CopperSickle
  BronzeSickle
  IronSickle
  BronzeScythe
  Scythe
  Shovel
  CopperShovel
  BronzeShovel
  IronShovel
  BronzeShearingScissors
  ShearingScissors
  FishingSpear
  Bow
  LongBow
  RecursiveBow
  WoodenCrossbow
  Crossbow
  StoneArrow
  CopperArrow
  BronzeArrow
  IronArrow
  WoodenBolt
  CopperBolt
  BronzeBolt
  IronBolt
  ThrowingRock
  Cudgel
  WoodenPike
  StonePike
  CopperPike
  BronzePike
  IronPike
  SpikedCudgel
  BronzeDagger
  IronDagger
  BronzeSword
  IronSword
  EliteSword
  BronzeBattleAxe
  IronBattleAxe
  BronzeMace
  IronMace
  EliteMace
  BronzePick
  IronPick
  ElitePick
  WoodenRoundShield
  CopperRoundShield
  BronzeRoundShield
  CopperKiteShield
  BronzeKiteShield
  IronKiteShield
  EliteShield
  BronzeHelmet
  BronzeArmour
  BronzeBracers
  BronzeLegwear
  BronzeGreaves
  IronHelmet
  IronArmour
  IronBracers
  IronLegwear
  IronGreaves
  EliteHelmet
  EliteCollar
  EliteArmour
  EliteBracers
  EliteLegwear
  EliteGreaves
  Horseshoes
  Ash
```


## DT_ListOfItems — items, food stats, freshness (added 2026-10-08 00:17)

619 rows. Sub-fields per item read with a scratch script over the UAssetGUI JSON (filter: food/water/health/price/freshness/protection). Durability of tools is NOT among these fields — locate it in phase 0.

```
== Apple: Settings.Category=None | Settings.SubCategory=None | Settings.UseFreshness=True | Settings.FreshnessPerSeason=0.5 | Settings.ExpiredItems.ExpiredItems.Item.RowName=Rot | Settings.ShopType=None | Stats.Weight=0.09000000357627869 | Stats.Food=0.03999999910593033 | Stats.Water=0.029999999329447746 | Stats.Health=0.10000000149011612 | Stats.Price=4.0 | Stats.HealthPerSecond=+0 | Stats.FoodMultiplier=1.0 | Stats.WaterMultiplier=1.0 | Stats.WeaponDamageType=None | ToolSettings.ToolType=None | ToolSettings.ToolType=None | OutfitSettings.HeatProtection=+0 | OutfitSettings.ColdProtection=+0 | OutfitSettings.WeightCapacity=+0
== Carrot: Settings.Name=Carrot | Settings.Category=None | Settings.SubCategory=None | Settings.UseFreshness=True | Settings.FreshnessPerSeason=0.5 | Settings.ExpiredItems.ExpiredItems.Item.RowName=Rot | Settings.ShopType=None | Stats.Weight=0.10000000149011612 | Stats.Food=0.029999999329447746 | Stats.Water=+0 | Stats.Health=+0 | Stats.Price=2.0 | Stats.HealthPerSecond=+0 | Stats.FoodMultiplier=1.0 | Stats.WaterMultiplier=1.0 | Stats.WeaponDamageType=None | ToolSettings.ToolType=None | ToolSettings.ToolType=None | OutfitSettings.HeatProtection=+0 | OutfitSettings.ColdProtection=+0 | OutfitSettings.WeightCapacity=+0
== Berry: Settings.Category=None | Settings.SubCategory=None | Settings.UseFreshness=True | Settings.FreshnessPerSeason=0.5 | Settings.ExpiredItems.ExpiredItems.Item.RowName=Rot | Settings.ShopType=None | Stats.Weight=0.05000000074505806 | Stats.Food=0.0020000000949949026 | Stats.Water=0.019999999552965164 | Stats.Health=+0 | Stats.Price=0.20000000298023224 | Stats.HealthPerSecond=+0 | Stats.FoodMultiplier=1.0 | Stats.WaterMultiplier=1.0 | Stats.WeaponDamageType=None | ToolSettings.ToolType=None | ToolSettings.ToolType=None | OutfitSettings.HeatProtection=+0 | OutfitSettings.ColdProtection=+0 | OutfitSettings.WeightCapacity=+0
== RyeBread: Settings.Category=None | Settings.SubCategory=None | Settings.UseFreshness=True | Settings.FreshnessPerSeason=0.3499999940395355 | Settings.ExpiredItems.ExpiredItems.Item.RowName=Rot | Settings.ShopType=None | Stats.Weight=0.4000000059604645 | Stats.Food=0.800000011920929 | Stats.Water=+0 | Stats.Health=+0 | Stats.Price=27.0 | Stats.HealthPerSecond=+0 | Stats.FoodMultiplier=1.0 | Stats.WaterMultiplier=1.0 | Stats.WeaponDamageType=None | ToolSettings.ToolType=None | ToolSettings.ToolType=None | OutfitSettings.HeatProtection=+0 | OutfitSettings.ColdProtection=+0 | OutfitSettings.WeightCapacity=+0
== Porridge: Settings.Category=None | Settings.SubCategory=None | Settings.UseFreshness=True | Settings.FreshnessPerSeason=0.5 | Settings.ExpiredItems.ExpiredItems.Item.RowName=Rot | Settings.ShopType=None | Stats.Weight=0.20000000298023224 | Stats.Food=0.2800000011920929 | Stats.Water=0.05000000074505806 | Stats.Health=+0 | Stats.Price=17.0 | Stats.HealthPerSecond=+0 | Stats.FoodMultiplier=1.0 | Stats.WaterMultiplier=1.0 | Stats.WeaponDamageType=None | ToolSettings.ToolType=None | ToolSettings.ToolType=None | OutfitSettings.HeatProtection=+0 | OutfitSettings.ColdProtection=+0 | OutfitSettings.WeightCapacity=+0
== Stew: Settings.Category=None | Settings.SubCategory=None | Settings.UseFreshness=True | Settings.FreshnessPerSeason=0.5 | Settings.ExpiredItems.ExpiredItems.Item.RowName=Rot | Settings.ShopType=None | Stats.Weight=0.75 | Stats.Food=0.4000000059604645 | Stats.Water=0.10000000149011612 | Stats.Health=+0 | Stats.Price=20.0 | Stats.HealthPerSecond=+0 | Stats.FoodMultiplier=1.0 | Stats.WaterMultiplier=1.0 | Stats.WeaponDamageType=None | ToolSettings.ToolType=None | ToolSettings.ToolType=None | OutfitSettings.HeatProtection=+0 | OutfitSettings.ColdProtection=+0 | OutfitSettings.WeightCapacity=+0
== Soup: Settings.Category=None | Settings.SubCategory=None | Settings.UseFreshness=True | Settings.FreshnessPerSeason=0.5 | Settings.ExpiredItems.ExpiredItems.Item.RowName=Rot | Settings.ShopType=None | Stats.Weight=0.75 | Stats.Food=0.5 | Stats.Water=0.20000000298023224 | Stats.Health=+0 | Stats.Price=39.0 | Stats.HealthPerSecond=+0 | Stats.FoodMultiplier=1.0 | Stats.WaterMultiplier=1.0 | Stats.WeaponDamageType=None | ToolSettings.ToolType=None | ToolSettings.ToolType=None | OutfitSettings.HeatProtection=+0 | OutfitSettings.ColdProtection=+0 | OutfitSettings.WeightCapacity=3.0
== RoastedMeat: Settings.Category=None | Settings.SubCategory=None | Settings.UseFreshness=True | Settings.FreshnessPerSeason=0.5 | Settings.ExpiredItems.ExpiredItems.Item.RowName=Rot | Settings.ShopType=None | Stats.Weight=0.20000000298023224 | Stats.Food=0.11999999731779099 | Stats.Water=+0 | Stats.Health=+0 | Stats.Price=6.0 | Stats.HealthPerSecond=+0 | Stats.FoodMultiplier=1.0 | Stats.WaterMultiplier=1.0 | Stats.WeaponDamageType=None | ToolSettings.ToolType=None | ToolSettings.ToolType=None | OutfitSettings.HeatProtection=+0 | OutfitSettings.ColdProtection=+0 | OutfitSettings.WeightCapacity=+0
== MeatPie: Settings.Category=None | Settings.SubCategory=None | Settings.UseFreshness=True | Settings.FreshnessPerSeason=0.5 | Settings.ExpiredItems.ExpiredItems.Item.RowName=Rot | Settings.ShopType=None | Stats.Weight=1.0 | Stats.Food=1.0 | Stats.Water=+0 | Stats.Health=+0 | Stats.Price=110.0 | Stats.HealthPerSecond=+0 | Stats.FoodMultiplier=1.0 | Stats.WaterMultiplier=1.0 | Stats.WeaponDamageType=None | ToolSettings.ToolType=None | ToolSettings.ToolType=None | OutfitSettings.HeatProtection=+0 | OutfitSettings.ColdProtection=+0 | OutfitSettings.WeightCapacity=15.0
== Pickaxe: Settings.Category=None | Settings.SubCategory=None | Settings.UseFreshness=False | Settings.FreshnessPerSeason=+0 | Settings.ShopType=None | Stats.Weight=5.0 | Stats.Food=+0 | Stats.Water=+0 | Stats.Health=+0 | Stats.Price=880.0 | Stats.HealthPerSecond=+0 | Stats.FoodMultiplier=1.0 | Stats.WaterMultiplier=1.0 | Stats.WeaponDamageType=None | ToolSettings.ToolType=None | ToolSettings.ToolType=None | OutfitSettings.HeatProtection=+0 | OutfitSettings.ColdProtection=+0 | OutfitSettings.WeightCapacity=+0
== IronAxe: Settings.Category=None | Settings.SubCategory=None | Settings.UseFreshness=False | Settings.FreshnessPerSeason=+0 | Settings.ShopType=None | Stats.Weight=3.5 | Stats.Food=+0 | Stats.Water=+0 | Stats.Health=+0 | Stats.Price=880.0 | Stats.HealthPerSecond=+0 | Stats.FoodMultiplier=1.0 | Stats.WaterMultiplier=1.0 | Stats.WeaponDamageType=None | ToolSettings.ToolType=None | ToolSettings.ToolType=None | OutfitSettings.HeatProtection=+0 | OutfitSettings.ColdProtection=+0 | OutfitSettings.WeightCapacity=+0
== Shirt_A: Settings.Category=None | Settings.SubCategory=None | Settings.UseFreshness=False | Settings.FreshnessPerSeason=+0 | Settings.ShopType=None | Stats.Weight=0.25 | Stats.Food=+0 | Stats.Water=+0 | Stats.Health=+0 | Stats.Price=300.0 | Stats.HealthPerSecond=+0 | Stats.FoodMultiplier=1.0 | Stats.WaterMultiplier=1.0 | Stats.WeaponDamageType=None | ToolSettings.ToolType=None | ToolSettings.ToolType=None | OutfitSettings.HeatProtection=0.019999999552965164 | OutfitSettings.ColdProtection=0.03999999910593033 | OutfitSettings.WeightCapacity=+0
== Shoes: Settings.Category=None | Settings.SubCategory=None | Settings.UseFreshness=False | Settings.FreshnessPerSeason=+0 | Settings.ShopType=None | Stats.Weight=0.15000000596046448 | Stats.Food=+0 | Stats.Water=+0 | Stats.Health=+0 | Stats.Price=290.0 | Stats.HealthPerSecond=+0 | Stats.FoodMultiplier=1.0 | Stats.WaterMultiplier=1.0 | Stats.WeaponDamageType=None | ToolSettings.ToolType=None | ToolSettings.ToolType=None | OutfitSettings.HeatProtection=+0 | OutfitSettings.ColdProtection=0.14000000059604645 | OutfitSettings.WeightCapacity=+0
== FurBoots: Settings.Name=WarmBoots | Settings.Category=None | Settings.SubCategory=None | Settings.UseFreshness=False | Settings.FreshnessPerSeason=+0 | Settings.ShopType=None | Stats.Weight=0.3499999940395355 | Stats.Food=+0 | Stats.Water=+0 | Stats.Health=+0 | Stats.Price=830.0 | Stats.HealthPerSecond=+0 | Stats.FoodMultiplier=1.0 | Stats.WaterMultiplier=1.0 | Stats.WeaponDamageType=None | ToolSettings.ToolType=None | ToolSettings.ToolType=None | OutfitSettings.HeatProtection=-0.07999999821186066 | OutfitSettings.ColdProtection=0.23000000417232513 | OutfitSettings.WeightCapacity=+0
```

## Durability — where it lives (offline, 2026-10-08)

- `DT_ListOfItems` has NO durability field (619 rows; fields Settings/Stats/ToolSettings/OutfitSettings/AmmoSettings/Physics/VendorSettings).
- Native C++ `ABaseEconomyManager` (`Managers/Economy/BaseEconomyManager.cpp`) exposes reflected UFUNCTIONs (PDB symbols `UFunction_ABaseEconomyManager_*`): `GetDurability`, `GetDurabilityAtIndex`, `ChangeDurabilityData`, `UpdateDurabilityData`, `SetDurabilityDataArray`, `ClearDurabilityData` — callable from UE4SS.
- `BP_EconomyManager` (child BP) has `Add Used Durability` and `MockDurabilityData`; UI: `DT_ProducedToolsDurability`, `ST_ProducedDurability`, curve `C_DurabilityToolColors`.
- Per-instance durability of a carried tool: presumably in the inventory slot struct (`Comp/Inventory/InventoryStructs.h` in PDB) — confirm live (plan 16 step 0.9).

## Level contents of both maps — offline census of placed actors (2026-10-08)

Method: `UAssetGUI tojson Map_Gameplay.umap VER_UE4_27` (Valley 892 MB JSON in 13 s; Oxbow `MP_Map/Map_Gameplay.umap`), then export names counted by class with the instance suffix stripped (`grep -o '"ObjectName": …' | sed | sort | uniq -c`). Plain-class counts only: classes with variant suffixes (`BP_Building_House_A`, `_D`, modular `BP_BuildModule_House_*`) are NOT in the building totals. **No NPC actors are placed in the level files** (besides 5 `NPCs_Purgatorium`): villagers are spawned at runtime by `BP_NPC_Manager` — whether far villagers stay in memory is a LIVE question (plan 16 step 0.2).

### Map_Gameplay

```
    604 BP_SpawnPointWildAnimal
    220 BP_StaticRoadSpline
    108 BP_POI_Resources
     92 BP_POI_Treasure
     90 BP_POI_Accident
     70 BP_POI_Animals
     65 BP_POI_Misc
     63 BP_POI_Encounter
     34 BP_POI_Bandits
     21 BP_POI_BanditsMedium
     11 BP_Marker_Village
     10 BP_Building_Woodshed
     10 BP_Building_FoodStorage
      7 BP_Building_ToolShed
      7 BP_Building_Barn
      6 BP_POI_BanditsHard
      6 BP_Building_FarmShed
      5 NPCs_Purgatorium
      5 BP_Building_ResourceStorage
      4 BP_Building_Well
      4 BP_Building_Tavern
      4 BP_Building_Sewing
      4 BP_Building_Kitchen
      4 BP_Building_HuntingLodge
      4 BP_Building_House
      3 BP_Building_Smithy
      3 BP_Building_HerbalistsHut
      3 BP_Building_HenHouse
      3 BP_Building_GooseHouse
      3 BP_Building_Fold
      3 BP_Building_ExcavationShed
      2 BP_RoadManager
      2 BP_POI_Manager
      2 BP_Building_Workshop
      2 BP_Building_Windmill
      2 BP_Building_Pigsty
      2 BP_Building_HorseStable
      2 BP_Building_FishingHut
      2 BP_Building_DonkeyStable
      2 BP_Building_Cowshed
      2 BP_Building_Apiary
      1 BP_POI_Spawner
      1 BP_POI_Quest
      1 BP_Building_BuildersHut
plain BP_Building_* total: 104
```

### MP_Map_Gameplay

```
    604 BP_SpawnPointWildAnimal
    198 BP_StaticRoadSpline
    159 BP_POI_Treasure
    101 BP_POI_Encounter
     93 BP_POI_Resources
     86 BP_POI_Misc
     85 BP_POI_Quest
     55 BP_POI_Accident
     50 BP_Building_House
     35 BP_POI_Bandits
     23 BP_POI_BanditsMedium
      7 BP_POI_BanditsHard
      7 BP_POI_Animals
      6 BP_Building_MarketStall
      5 NPCs_Purgatorium
      5 BP_Marker_Village
      4 BP_Building_Workshop
      4 BP_Building_Woodshed
      4 BP_Building_Smithy
      4 BP_Building_HerbalistsHut
      3 BP_Building_Sewing
      3 BP_Building_ResourceStorage
      3 BP_Building_Kitchen
      3 BP_Building_HuntingLodge
      3 BP_Building_FoodStorage
      3 BP_Building_Fold
      3 BP_Building_FishingHut
      3 BP_Building_FarmShed
      3 BP_Building_BuildersHut
      3 BP_Building_Barn
      2 BP_RoadManager
      2 BP_POI_Manager
      2 BP_Building_Windmill
      2 BP_Building_Well
      2 BP_Building_Tavern
      2 BP_Building_Pigsty
      2 BP_Building_Mine
      2 BP_Building_HorseStable
      2 BP_Building_HenHouse
      2 BP_Building_GooseHouse
      2 BP_Building_ExcavationShed
      2 BP_Building_DonkeyStable
      2 BP_Building_Cowshed
      2 BP_Building_Apiary
      1 BP_POI_Spawner
plain BP_Building_* total: 126
```


Totals reconciled: Valley — 145 `BP_Building_*` actors including house variants (`House_D` 21, `House_A` 20), 104 plain-class; Oxbow — 128 including `House_Sedowin` 2, 126 plain-class. Roads: 220 (Valley) and 198 (Oxbow) `BP_StaticRoadSpline` — spline points not yet extracted (plan 16 step 0.8, roads half).

## Village names of the Valley (offline, 2026-10-08)

From the 11 `BP_Marker_Village` exports of `Map_Gameplay.umap` (enum `E_Ownership` + label text): Green=Branica, SkyBlue=Baranica, Red=Borowo, Pink=Gostovia, Orange=Denica, Yellow=Jezerica, Purple=Hornica, NavyBlue=Rolnica, Burgundy=Lesnica. Blue (NewEnumerator6) and Brown (NewEnumerator16): two markers carry no serialized properties (default values are not written) — names open, confirm live. Pack data: `MedievalDynasty/data/villages_valley.csv` column `game_name`.

Oxbow (`MP_Map/Map_Gameplay.umap`, 5 markers): Green=Klonica, SkyBlue=Ostoya, Red=Skauki; one instance marker without serialized properties (Blue, NewEnumerator6, by elimination — name open) plus the class default object `BP_Marker_Village_C` (in the Valley count too: 10 instances + 1 CDO, so the Valley list above has 9 named + 1 unnamed instance; Brown has no marker — confirm live).

## Who listens to the clock (offline, 2026-10-08)

Delegate names of `BP_TimeManager` counted in each manager's UAssetGUI JSON (references in bytecode/bindings):

| Manager | References |
|---|---|
| BP_NPC_Manager | OnDaySkip 8 · OnSeasonChanged 31 · OnTimeOfDay_NPC_Changed 5 |
| BP_VillageManager | OnSeasonChanged 23 · OnTimeUpdate 8 · OnTimeUpdate_Minutes 7 |
| BP_EconomyManager | OnDaySkip 5 · OnSeasonChanged 5 · OnTimeUpdate_Days 5 |
| BP_AnimalsManager | OnSeasonChanged 9 |
| BP_EventManager, BP_KingdomManager, BP_POI_Manager | none |

**Nobody listens to `OnTimeUpdate_Hours`.** Hook candidates for the mod's hourly tick (UE4SS cannot hook delegates; BP hooks fire after the function): `BP_VillageManager:OnMinuteUpdate` (every game minute — count to 60), `BP_NPC_Manager:OnTimeOfDayChanged` (time-of-day phases), `BP_EconomyManager:DayChanged` (daily), `OnSeasonChanged` (seasonal). Confirm live (plan 16 step 0.3).

## Save slots (offline, 2026-10-08)

`%LOCALAPPDATA%\Medieval_Dynasty\Saved\SaveGames`: every slot is a pair `<slot>.sav` + `<slot>_Label.sav` (metadata for the menu); slots of the Oxbow map end in `_Ox` (`<slot>_Ox.sav`, `<slot>_Ox_Label.sav`); autosaves rotate as `Autosave.sav`, `Autosave1.sav`, `Autosave2.sav` (+ `_Ox`). 50 files on the owner's machine (names not recorded here). Managers persist through their own `SaveDataFromSystemToFile` / `LoadSaveFileIntoSystem` (NPC, Village, Event, Animals, Time) and `SaveKingdomData`, `SaveSpawners` (POI), `SaveEconomyData`. **Mod book file → beside the slot as `<slot>_KrinikWorld.<ext>`** (same stem keeps Valley/Oxbow and autosave rotation apart); confirm which manager save fires first and with which slot name live (plan 16 step 0.4).

## Start-up chain (2026-10-08, offline + one launch)

- Startup movies: `Config/DefaultGame.ini` (pak) → AsyncLoadingScreen `StartupLoadingScreen` MoviePaths `Logo_UE, Logo_Toplitz, Logo_RenderCube, Loading_Short`, `MT_LoadingLoop`; files are loose `Content/Movies/*.bk2`. Renamed to `.bk2.off` (pack `tools/intro.py`): `Map_Init → Map_MainMenu` 10 s → 0.04 s, menu 5 s after process start; no log errors.
- Then two screens wait for a key: `UI_IntroScreen` («Нажмите любую кнопку»; functions `AnyKey(Key)`, `Close()`, `Confirm(out InputHandled)`, `OnKeyDown` casts `GM_Medieval_Dynasty`) and `UI_EpicOnlineServicesLoading` (`ConnectionFailed()`, `ChangeToWarning`, `ConfirmAction()`, `DestroyWindow()`); `UI_OfflineErrorAcceptation` also exists. Fast-start mod draft: pack `_unpacked/KrinikFastStart` (NOT-TESTED).
- Main menu has NO «Continue»: load = «Загрузить игру» → slot → «Соло / Кооператив» → «<map> (Соло) / Начать игру».
- HDR: user `GameUserSettings.ini` `bUseHDRDisplayOutput=False` by default and the game config has no `r.AllowHDR`; with `r.AllowHDR=1` in user `Engine.ini [SystemSettings]` + the flag → log «HDR output is supported», «Setting HDR meta data … DisplayGamut 2»; survives game exit. Pack `tools/hdr.py`.

## Live notes (2026-10-08 01:16–01:17, Oxbow, owner save)

- `SvarogsDream/tools/shot-hdr.ps1` and `focus-game.ps1` tap **Alt** to win foreground; in Medieval Dynasty **LeftAlt = «Режим проверки» (inspector mode)** — every such screenshot toggles the labels overlay. Game state is unaffected; screenshots and the owner's screen are. Fix for MD tools: a focus trick without Alt.
- `BP_VillageManager:OnTimeUpdate` fires **10 times per real second** (a real-time timer, not game minutes); `BP_NPC_Manager:OnTimeOfDayChanged` fired once at 01:17:14 (~70 s after load); `LoadSaveFileIntoSystem` of the village fired 2 s after hooks registered (after map load).
- HDR in world: night village — median 3 nits, UI white text at the TV peak (798 nits): HDR UI may be harsh — owner's taste.

## Game clock calibration (live, 2026-10-08 01:23, Oxbow)

`BP_VillageManager:OnMinuteUpdate` (zond v2): call #1 at 01:23:35, #10 at 01:23:53 → **1 game minute = 2 real seconds; 1 game hour = 120 s; 1 game day = 48 min real** (at the save's default time speed). The earlier «silent minute hook» (v1, logged every 60th call, watched ~110 s) was a false alarm — corrected here. `OnTimeUpdate` = 10 Hz real-time timer. Mod's hourly world tick → every 60th `OnMinuteUpdate`.

## How the game freezes far villagers — the optimization ladder (offline bytecode + live, 2026-10-08 01:38–01:41, Oxbow)

**Lever found: one float per villager — `BP_BoostComponent.ActiveRadius` (default 12000 cm = 120 m).**

- Every character carries `BP_BoostComponent` (`Content/Blueprints/Components/`). A looping timer (`RunOptimizationLogic` → `K2_SetTimer("DistanceCheckForDisplayNPC", 0.3–0.5 s)`) calls `CalculateDistanceForDisplay(Close, Medium, Far, Active radius × GetCurrentViewDistanceScale)` and writes `OptimizationStage` 0–4.
- CDO radii: **Close 15 m · Medium 35 m · Far 60 m · Active 120 m**. Stage 4 = beyond `ActiveRadius` → multicast `DeactivateNPC`.
- `BP_NPC` reacts with `ChangeDisabledOptimization(true)`: pauses `FallingTimerHandle` and `CheckUnderTheMapTimer`, `SetActorTickEnabled(false)`, `UnregisterNavigationInvoker`, and on the server `NavigationInvoker.SetActive(false)` + tick off. The `false` branch reverses it: unpause timers, actor tick interval `GetTickInterval_OutOfSight_Movement`, `AI_ResetNavInvoker`, nav-invoker tick interval.
- `GetOptimalizationStage` is declared on `BP_BaseCharacter` (hero, NPCs, animals share it) and reads `BP_BoostComponent.OptimizationStage`; not native (absent from exe and PDB).
- Tick intervals are randomized per NPC. **Corrected 2026-10-08 02:22 (judge pass; the first version had the branches reversed):** on PC (`IsConsoleOldGen` = false) Base 0.014–0.018 s, Close 0.020–0.024, Medium 0.031–0.035, Far 0.048–0.052, stage check every 0.3–0.4 s; console old-gen gets the LONGER ranges (Base 0.031–0.035 … Far 0.098–0.102, check 0.4–0.5 s) — the game already staggers its villagers so they don't all tick on one frame.
- **View distance matters:** radii are multiplied by `GetCurrentViewDistanceScale` — the player's graphics «view distance» setting widens or narrows the living circle.

Live (bridge v7 `stages`, hero at home on Oxbow):

| Class | Stage | Count | Tick on | Distance to hero, m (avg [min…max]) |
|---|---|---|---|---|
| `BP_NPC_Multi_Village_C` | 4 | 97 | 0 | 801 [445…1468] |
| `BP_NPC_C` | 0 | 6 | 6 | 525 [8…3097] |
| `BP_NPC_C` | 1 | 12 | 12 | 25 [16…34] |
| `BP_NPC_C` | 2 | 15 | 15 | 44 [9…57] |
| `BP_NPC_C` | 3 | 44 | 44 | 55 [20…110] |
| `BP_NPC_C` | 4 | 107 | 2 | 777 [130…1468] |

Border between stage 3 and 4 is clean (110 m vs 130 m), matching `ActiveRadius` 120 m. Stages 1–3 overlap (9–110 m) — the stage lags the distance by one timer period and the radii are scaled by view distance. **Open:** the six stage-0 NPCs up to 3 km away (never optimized — likely `IsBoostEnabled` false: waggoners? quest NPCs?) and the two stage-4 NPCs with tick on.

**For the epic:** waking far villagers is not a rewrite — raise `ActiveRadius` (all, or only for villagers the world server is «playing» right now) and the game's own AI resumes. The price is their tick (Far interval on PC ≈0.05 s each — corrected 02:22, was «≈0.1 s») — measure before choosing between «wake them all» and «bridge moves records, actors wake near the hero». Writing the property is an ACTION (EXP-0059): its own test case and run.

**Lever proven live (2026-10-08 01:46, Oxbow, mod `KrinikWake` v1):** `ActiveRadius` 120 → 2000 m on the 97 `BP_NPC_Multi_Village_C` → within ≈10 s all 97 on stage 3, tick on 97/97; in the next ≈23 s (≈11 game minutes) **80 of 97 moved, up to 32 m**. Control in the same session before the write: 0 of 97 moved in 22 s. The villagers' own AI is intact — only distance switches it off. Not measured: frame cost (needs admin, step 0.6), whether they follow their schedule (work, home) or just wander. Report `testcases/reports/2026-10-08_md-phase0-wake-far-villagers.md`.

**Frame cost of waking (2026-10-08 01:49–01:52, Oxbow, bridge v8 `frames` = `KismetSystemLibrary.GetFrameCount` over `GameplayStatics.GetRealTimeSeconds`, no admin needed):** A-B-A — frozen 108–120 FPS (8.4–9.3 ms, first window 119.6 — likely a 120 cap, not verified) → 97 woken 75–77 FPS (13.1–13.3 ms) → refrozen 92–94 FPS (10.7–10.8 ms). **97 woken villagers ≈ 2.5–4 ms per frame, ≈30 µs each**; the scene drifts ≈1.5–2 ms on its own. Report `testcases/reports/2026-10-08_md-phase0-wake-frame-cost.md`.

## Steering a villager — what the game offers (offline + one live run, 2026-10-08 01:57–02:02)

- Blackboard `BB_Multi_Village_NPC` keys: `DailyMode` (E_DailyMode: Housework, Work, Free Time, Sleep, Talk, Quest Specific), `MultiState` (E_MultiState by value: 0 Activity · 1 Talk with Player · 2 Move Aside · 3 Lead · **4 Go to Location** · 5 Optimization · 6 Get Out), `ResourceState`, `Talk`, `TargetLocation`, `TargetRotation`, `Furniture`, `LookAtTarget`, `RotateToPlayer`, `SelfActor`. Tree `BT_Multi_Village_NPC`.
- **`AIMulti_SetQuestPath(Destination)` is quest rails, not «go there»:** the inner `SetQuestPath` looks the villager up in `DT_QuestMultiNPCsRoads` (2 rows: `NPC_Q_M551`, `NPC_Q_F226`) and walks a pre-recorded quest road. For everyone else it is a no-op — live: 5 led villagers 1105 → 1105 m in 60 s (report `testcases/reports/2026-10-08_md-phase0-lead-villager-questpath.md`).
- **General candidates on the controller `AIC_NPC`** (parent of `AIC_NPC_Multi_Village`): `AI_SetPath(CheckDistance, Distance, Destination)`, `AI_GetPaths` / `AI_GetPathsPoint`, `AI_StopMovement`, `AI_MoveAside`, `AI_GoToTeleport(OnSuccess, Location, PathPoints)`, `SetBlackboardValues_MultiState` / `_DailyMode` / `_DailyCycle`; plus a family of `AI_Find*` (field, workplace, house, tavern, campfire, fishing point, animal…) — the villager's own job finder.
- **Schedules are data:** `DT_Multi_Village_SeasonsBehavior`, `DT_Multi_Village_NewSeasonsBehavior` (9 named NPCs, `ActivitiesBySeason[4]` of `ST_Multi_Village_Activities`), `DT_Multi_Village_NewCastellan_SeasonsBehavior`; `AIMulti_ChangeBehavior(NewBehaviorDT: Name)` sets `BehaviorDT_Name` → `SetActivitiesBySeason`, `SetMultiFurniture`. **Correction 2026-10-08 02:18 (bytecode of `SetActivitiesBySeason`):** the name picks one of THREE tables (`SeasonsBehavior` / `NewSeasonsBehavior` / `NewCastellanSeasonsBehavior`), and the row is still looked up by the villager's OWN `ID` — so it does NOT give a villager someone else's schedule; the earlier «profession lever» claim here was wrong.
- **`AI_SetPath` (the dev cheat menu's «call NPCs to me») does not lead a far villager either** — live 02:04–02:06: 5 nearest (≈455 m) 455 → 470 m in 60 s vs control 456 → 460 m (report `testcases/reports/2026-10-08_md-phase0-lead-villager-setpath.md`). `BP_NPC:SetPath` builds a helper path from the villager's workplace (`WorkPlaceReference`, traces, a cave branch) for schedule tasks.
- **Who really steers (offline):** `BTService_SetMultiNPCAIState.SetBehavior` runs on every service tick: `AIMulti_CheckActivitiesTime` → on activity change `StopMovement`, `DailyMode` ← activity, **`TargetLocation` ← the activity's transform**, `MultiState` reset by the service. So a raw blackboard write would be overwritten; **the steering wheel is the schedule itself** — an activity (time + place) in `ST_Multi_Village_Activities`. To send a villager to another village: give it an activity whose place is there (replace the activity entry in the villager's in-memory `ActivitiesBySeason` copy, or a pak edit of its table row; `AIMulti_ChangeBehavior` only switches between three tables for the villager's own ID — see correction above). Next test candidate.
- **Developer cheat menu `UI_CheatMenu`** has ready recipes for phase 0.5: `SpawnBandit`, `SpawnNPC`, `SpawnAnimal`, `Force spawn selected POI`, `SpawnPresetConfirm`, `TeleportToLocation`, «summon all NPCs» (`GetAllNPCs` → `AI_SetPath`).
- **The schedule, read (offline 2026-10-08 02:08):** `DT_Multi_Village_SeasonsBehavior` — 91 named villagers × 4 seasons; per season 10–47 activities (avg 19.3) of `ST_Multi_Village_Activities` = `ActivityID` (e.g. «H1») · `DailyMode` · `StartTime`/`EndTime` (`ST_Hour`, half-hour slots like 7:00–7:29:59) · **`TransformLocation` — an absolute world transform**. 1562 distinct places. Modes over all slots: Free Time 2646 · Housework 2621 · Work 972 · Sleep 360 · Talk 350 · Quest Specific 84. (Which map this table serves vs `DT_Multi_Village_NewSeasonsBehavior` (9 rows) — open; Oxbow has 97 live multi-villagers.)
- **For the epic:** a villager's day is already data — time slot + place + mode. Steering a woken villager = putting a slot with a far place into its schedule (in memory: the NPC's copied activity list; on disk: a pak edit of the table). A caravan is then «Work from 6:00 to 12:00 at village B's market» — the game walks it there itself. Not tested live yet.
- **Current activity reads live (2026-10-08 02:16, bridge v9 `activity`):** `AIMulti_GetCurrentActivity` on frozen villagers → `Success=false` (no activity while on stage 4); after waking (2000 m) → 5 of 5 read: Free Time from 7 h ×4, Talk from 21 h ×1, each **0–4 m from its activity place** — a woken villager stands where its schedule says. UE4SS 1161 puts ALL out-values into the FIRST table (struct fields flattened next to `Success`) — `EXPERIENCE.md` EXP-0177. Report `testcases/reports/2026-10-08_md-phase0-read-current-activity.md`.
- **Steering by schedule — PROVEN live (2026-10-08 10:08–10:14, `KrinikWake` v4 `goto … sched`):** rewriting every slot's
  `TransformLocation_13_F83762574EE5EEF263B71BA0F7B361ED` in every season of `ActivitiesBySeason` (array field
  `Activities_7_62A1E4E94789D4460B46F2A85E915C4F`) to a point and setting `CurrentActivityID = -1` → 5/5 led villagers walk
  there with the game's own AI (455 → 237 m in 6 min; control 456 → 458; the bridge reads their current place = our point).
  UE4SS 1161 Lua: `TMap:ForEach(k, v)` and `TArray:ForEach(i, e)` with `:get()` give struct wrappers whose writes stick.
  **Open:** ≈3 min until the first step — the reset index did not trigger an immediate re-pick (service tick or the
  half-hour slot boundary). Report `testcases/reports/2026-10-08_md-phase0-steer-by-schedule.md`.
