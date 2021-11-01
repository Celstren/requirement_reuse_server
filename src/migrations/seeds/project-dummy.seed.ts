export const userDummySeed = [
    {
        firstName:"Pepe",
        email:"pepeluxo@gmail.com"
    }
]

export const marketTypeSeed = ({profileUserId}) => [
    {
        marketTypeName:"Bioengineer 1",
        project:    {
            projectName:'Project1',
            visibility:'PUBLIC',
            profileUserId,
            templateUrl:null,
            productBacklogs:[
                {
                    productBacklogName:'BIO1-sprint01',
                    requirements:[
                        {
                            systemDescription:"Sistema para registrar ventas",
                            actorDescription:"vendedor",
                            actionDescription:"registro de ventas",
                            requirementType:"FUNCTIONAL",
                            requirementPriorities:[
                                {
                                    priorityValue:"4",
                                    priorityType:"Ranking",
                                    profileUserId
                                }
                            ]
                        }
                    ]
                },
                {
                    productBacklogName:'BIO1-sprint02',
                    requirements:[
                        {
                            systemDescription:"Sistema para registrar ventas",
                            actorDescription:"vendedor",
                            actionDescription:"registro de ventas",
                            requirementType:"FUNCTIONAL",
                            requirementPriorities:[
                                {
                                    priorityValue:"5",
                                    priorityType:"Ranking",
                                    profileUserId
                                }
                            ]
                        }
                    ]
                }
            ]
    
        }
    },
    {
        marketTypeName:"Bioengineer 2",
        project:    {
            projectName:'Project2',
            visibility:'PUBLIC',
            profileUserId,
            templateUrl:null,
            productBacklogs:[
                {
                    productBacklogName:'BIO2-sprint01',
                    requirements:[
                        {
                            systemDescription:"Sistema para registrar ventas",
                            actorDescription:"vendedor",
                            actionDescription:"registro de ventas",
                            requirementType:"FUNCTIONAL",
                            requirementPriorities:[
                                {
                                    priorityValue:"10",
                                    priorityType:"Ranking",
                                    profileUserId
                                }
                            ]
                        }
                    ]
                },
                {
                    productBacklogName:'BIO2-sprint02',
                    requirements:[
                        {
                            systemDescription:"Sistema para registrar ventas",
                            actorDescription:"vendedor",
                            actionDescription:"registro de ventas",
                            requirementType:"FUNCTIONAL",
                            requirementPriorities:[
                                {
                                    priorityValue:"1",
                                    priorityType:"Ranking",
                                    profileUserId
                                }
                            ]
                        }
                    ]
                }
            ]
    
        }
    },
    {
        marketTypeName:"Bioengineer 3",
        project:    {
            projectName:'Project3',
            visibility:'PUBLIC',
            templateUrl:null,
            profileUserId,
            productBacklogs:[
                {
                    productBacklogName:'BIO3-sprint01',
                    requirements:[
                        {
                            systemDescription:"Sistema para registrar ventas",
                            actorDescription:"vendedor",
                            actionDescription:"registro de ventas",
                            requirementType:"FUNCTIONAL",
                            requirementPriorities:[
                                {
                                    priorityValue:"7",
                                    priorityType:"Ranking",
                                    profileUserId
                                }
                            ]
                        }
                    ]
                },
                {
                    productBacklogName:'BIO3-sprint02',
                    requirements:[
                        {
                            systemDescription:"Sistema para registrar ventas",
                            actorDescription:"vendedor",
                            actionDescription:"registro de ventas",
                            requirementType:"FUNCTIONAL",
                            requirementPriorities:[
                                {
                                    priorityValue:"9",
                                    priorityType:"Ranking",
                                    profileUserId
                                }
                            ]
                        }
                    ]
                }
            ]
    
        }
        
    },
    {
        marketTypeName:"Bioengineer 4",
        project:    {
            projectName:'Project4',
            visibility:'PUBLIC',
            templateUrl:null,
            profileUserId,
            productBacklogs:[
                {
                    productBacklogName:'BIO4-sprint01',
                    requirements:[
                        {
                            systemDescription:"Sistema para registrar ventas",
                            actorDescription:"vendedor",
                            actionDescription:"registro de ventas",
                            requirementType:"FUNCTIONAL",
                            requirementPriorities:[
                                {
                                    priorityValue:"23",
                                    priorityType:"Ranking",
                                    profileUserId
                                }
                            ]
                        }
                    ]
                },
                {
                    productBacklogName:'BIO4-sprint02',
                    requirements:[
                        {
                            systemDescription:"Sistema para registrar ventas",
                            actorDescription:"vendedor",
                            actionDescription:"registro de ventas",
                            requirementType:"FUNCTIONAL",
                            requirementPriorities:[
                                {
                                    priorityValue:"11",
                                    priorityType:"Ranking",
                                    profileUserId
                                }
                            ]
                        }
                    ]
                }
            ]
    
        }
    },
    {
        marketTypeName:"Bioengineer 5",
        project:    {
            projectName:'Project5',
            visibility:'PUBLIC',
            profileUserId,
            templateUrl:null,
            productBacklogs:[
                {
                    productBacklogName:'BIO5-sprint01',
                    requirements:[
                        {
                            systemDescription:"Sistema para registrar ventas",
                            actorDescription:"vendedor",
                            actionDescription:"registro de ventas",
                            requirementType:"FUNCTIONAL"
                        }
                    ]
                },
                {
                    productBacklogName:'BIO5-sprint02',
                    requirements:[
                        {
                            systemDescription:"Sistema para registrar ventas",
                            actorDescription:"vendedor",
                            actionDescription:"registro de ventas",
                            requirementType:"FUNCTIONAL"
                        }
                    ]
                }
            ]
    
        }
    }
]


export const projectDummySeed = ({profileUserId,marketType}) => [
    {
        projectName:'Project1',
        visibility:'PUBLIC',
        profileUserId,
        templateUrl:null,
        productBacklogs:[
            {
                productBacklogName:'sprint01',
                requirements:[
                    {
                        systemDescription:"Sistema para registrar ventas",
                        actorDescription:"vendedor",
                        actionDescription:"registro de ventas",
                        requirementType:"FUNCTIONAL"
                    }
                ]
            },
            {
                productBacklogName:'sprint02',
                requirements:[
                    {
                        systemDescription:"Sistema para registrar ventas",
                        actorDescription:"vendedor",
                        actionDescription:"registro de ventas",
                        requirementType:"FUNCTIONAL"
                    }
                ]
            }
        ]

    },
    {
        projectName:'Project2',
        visibility:'PUBLIC',
        profileUserId,
        templateUrl:null,
        productBacklogs:[
            {
                productBacklogName:'sprint01',
                requirements:[
                    {
                        systemDescription:"Sistema para registrar ventas",
                        actorDescription:"vendedor",
                        actionDescription:"registro de ventas",
                        requirementType:"FUNCTIONAL"
                    }
                ]
            },
            {
                productBacklogName:'sprint02',
                requirements:[
                    {
                        systemDescription:"Sistema para registrar ventas",
                        actorDescription:"vendedor",
                        actionDescription:"registro de ventas",
                        requirementType:"FUNCTIONAL"
                    }
                ]
            }
        ]

    },
    {
        projectName:'Project3',
        visibility:'PUBLIC',
        templateUrl:null,
        profileUserId,
        productBacklogs:[
            {
                productBacklogName:'sprint01',
                requirements:[
                    {
                        systemDescription:"Sistema para registrar ventas",
                        actorDescription:"vendedor",
                        actionDescription:"registro de ventas",
                        requirementType:"FUNCTIONAL"
                    }
                ]
            },
            {
                productBacklogName:'sprint02',
                requirements:[
                    {
                        systemDescription:"Sistema para registrar ventas",
                        actorDescription:"vendedor",
                        actionDescription:"registro de ventas",
                        requirementType:"FUNCTIONAL"
                    }
                ]
            }
        ]

    },
    {
        projectName:'Project4',
        visibility:'PUBLIC',
        templateUrl:null,
        marketType,
        profileUserId,
        productBacklogs:[
            {
                productBacklogName:'sprint01',
                requirements:[
                    {
                        systemDescription:"Sistema para registrar ventas",
                        actorDescription:"vendedor",
                        actionDescription:"registro de ventas",
                        requirementType:"FUNCTIONAL"
                    }
                ]
            },
            {
                productBacklogName:'sprint02',
                requirements:[
                    {
                        systemDescription:"Sistema para registrar ventas",
                        actorDescription:"vendedor",
                        actionDescription:"registro de ventas",
                        requirementType:"FUNCTIONAL"
                    }
                ]
            }
        ]

    },
    {
        projectName:'Project5',
        visibility:'PUBLIC',
        profileUserId,
        marketType,
        templateUrl:null,
        productBacklogs:[
            {
                productBacklogName:'sprint01',
                requirements:[
                    {
                        systemDescription:"Sistema para registrar ventas",
                        actorDescription:"vendedor",
                        actionDescription:"registro de ventas",
                        requirementType:"FUNCTIONAL"
                    }
                ]
            },
            {
                productBacklogName:'sprint02',
                requirements:[
                    {
                        systemDescription:"Sistema para registrar ventas",
                        actorDescription:"vendedor",
                        actionDescription:"registro de ventas",
                        requirementType:"FUNCTIONAL"
                    }
                ]
            }
        ]

    }
]